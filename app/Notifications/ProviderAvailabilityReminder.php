<?php

namespace App\Notifications;

use App\Models\Provider;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Asks a provider to state / reconfirm whether they are accepting new clients.
 *  - never set → their listing shows "Contact to confirm availability" until they choose
 *  - due       → sent 7 days before the 60-day confirmation runs out (or once it has run out)
 *
 * Uses the Bahali email template: resources/views/emails/provider/availability-reminder.blade.php
 * (+ a plain-text version for clients that don't show HTML).
 */
class ProviderAvailabilityReminder extends Notification
{
    use Queueable;

    public function __construct(
        public Provider $provider,
        public bool $neverSet,
        public ?string $reconfirmBy = null,   // e.g. "Nov 20, 2026"
        public bool $expired = false,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $name = $this->provider->organization_name ?: 'there';
        $url  = url('/provider/dashboard');

        if ($this->neverSet) {
            $subject = 'Are you accepting new clients? Let visitors know on Bahali';
            $data = [
                'preheader'  => 'One click: tell visitors whether you are accepting new clients.',
                'heading'    => 'Are you accepting new clients?',
                'intro'      => [
                    'Your Bahali listing does not show whether you are accepting new clients yet, so visitors currently see "Contact to confirm availability".',
                    'It takes one click to choose "Yes" or "No".',
                ],
                'statusRows' => [],
                'notice'     => null,
                'actionText' => 'Set my availability',
                'outro'      => ['We will ask you to reconfirm every 60 days so your listing stays accurate.'],
            ];
        } else {
            $current = $this->provider->accepting_new_clients
                ? 'accepting new clients'
                : 'not currently accepting new clients';

            $subject = 'Please reconfirm your availability on Bahali';
            $data = [
                'preheader'  => $this->expired
                    ? 'Your listing now shows "Contact to confirm availability".'
                    : "Please reconfirm by {$this->reconfirmBy}.",
                'heading'    => $this->expired ? 'Your availability needs reconfirming' : 'Time to reconfirm your availability',
                'intro'      => ['Please take a moment to confirm whether you are still accepting new clients, so visitors see accurate information.'],
                'statusRows' => [
                    ['label' => 'Your listing says', 'value' => ucfirst($current)],
                    ['label' => $this->expired ? 'Reconfirmation was due' : 'Reconfirm by', 'value' => (string) $this->reconfirmBy],
                ],
                'notice'     => $this->expired
                    ? 'This has not been reconfirmed in the last 60 days, so your listing now shows "Contact to confirm availability".'
                    : 'If it is not reconfirmed by then, your listing will show "Contact to confirm availability" instead.',
                'actionText' => 'Reconfirm my availability',
                'outro'      => ['If nothing has changed, just choose the same answer and save.'],
            ];
        }

        return (new MailMessage)
            ->subject($subject)
            ->view(
                ['emails.provider.availability-reminder', 'emails.provider.availability-reminder-text'],
                $data + ['subject' => $subject, 'name' => $name, 'actionUrl' => $url]
            );
    }
}
