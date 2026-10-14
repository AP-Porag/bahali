<?php

use App\Models\Provider;
use App\Notifications\ProviderAvailabilityReminder;
use App\Services\Provider\ProviderService;
use App\Utils\GlobalConstant;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
 * Availability reminders ("Are you accepting new clients?") — published profiles only.
 *  - Availability never set (older profiles)    → one email asking them to choose Yes / No.
 *  - Confirmed 53+ days ago (7 days before the  → one email per 60-day cycle asking them to reconfirm.
 *    60-day window ends, or already past it)       Reconfirming resets the cycle.
 */
Artisan::command('providers:availability-reminders', function () {
    $remindAfter = ProviderService::availabilityRemindAfter();
    $sent = 0;

    Provider::with('user')
        ->where('status', GlobalConstant::VERIFICATION_STATUS_APPROVED)
        ->where(function ($q) use ($remindAfter) {
            // Never set — remind once.
            $q->where(function ($q) {
                $q->where(function ($q) {
                    $q->whereNull('accepting_new_clients')->orWhereNull('availability_confirmed_at');
                })->whereNull('availability_reminder_sent_at');
            })
                // Confirmation is about to run out (or has) — remind once since the last confirmation.
                ->orWhere(function ($q) use ($remindAfter) {
                    $q->whereNotNull('accepting_new_clients')
                        ->where('availability_confirmed_at', '<=', $remindAfter)
                        ->where(function ($q) {
                            $q->whereNull('availability_reminder_sent_at')
                                ->orWhereColumn('availability_reminder_sent_at', '<', 'availability_confirmed_at');
                        });
                });
        })
        ->chunkById(100, function ($providers) use (&$sent) {
            foreach ($providers as $provider) {
                $email = $provider->user?->email ?? $provider->contact_email;
                if (! $email) {
                    continue;
                }

                $neverSet = is_null($provider->accepting_new_clients) || is_null($provider->availability_confirmed_at);
                $expiresAt = $neverSet ? null : $provider->availability_confirmed_at->copy()->addDays(60);

                try {
                    Notification::route('mail', $email)->notify(new ProviderAvailabilityReminder(
                        $provider,
                        $neverSet,
                        $expiresAt?->format('M j, Y'),
                        $expiresAt ? $expiresAt->isPast() : false,
                    ));

                    // Don't touch updated_at — this is not a profile change.
                    $provider->timestamps = false;
                    $provider->forceFill(['availability_reminder_sent_at' => now()])->saveQuietly();
                    $sent++;
                } catch (\Throwable $e) {
                    Log::error('[availability-reminders] Failed to send', [
                        'provider_id' => $provider->id,
                        'error'       => $e->getMessage(),
                    ]);
                }
            }
        });

    $this->info("Availability reminders sent: {$sent}");
})->purpose('Email providers whose "accepting new clients" answer is missing or due for reconfirmation');

Schedule::command('providers:availability-reminders')->dailyAt('09:00');
