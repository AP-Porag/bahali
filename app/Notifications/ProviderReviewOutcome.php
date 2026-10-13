<?php

namespace App\Notifications;

use App\Models\Provider;
use App\Services\Provider\ProviderService;
use App\Utils\GlobalConstant;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Email sent to the provider after each review decision.
 *  - Needs correction  → the admin's specific instructions + link to edit the profile
 *  - Pending verification → passed screening, stays unpublished until verified + approved
 *  - Approved          → profile is live
 *  - Rejected          → recorded reason + option to request reconsideration
 *  - Suspended / Inactive → note from the team
 */
class ProviderReviewOutcome extends Notification
{
    use Queueable;

    public function __construct(
        public Provider $provider,
        public string $status,
        public ?string $note = null,
        public ?string $reasonLabel = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $name    = $this->provider->organization_name ?: 'there';
        $support = config('mail.from.address');
        $editUrl = route('provider.profile.edit');

        $mail = (new MailMessage)->greeting("Hello {$name},");

        switch ($this->status) {
            case ProviderService::STATUS_NEEDS_CORRECTION:
                $mail->subject('Action needed: please update your Bahali profile')
                    ->line('Thank you for submitting your profile to the Bahali Provider Directory. Before we can continue, a few things need to be updated:')
                    ->line($this->note ?: 'Please review your profile for missing or unclear information.')
                    ->action('Update my profile', $editUrl)
                    ->line('Once you save your changes, your profile goes back into review.');
                break;

            case ProviderService::STATUS_PENDING_VERIFICATION:
                $mail->subject('Your Bahali profile passed the initial review')
                    ->line('Your profile passed our initial review and has moved to verification.')
                    ->line('It will stay unpublished until verification and final approval are complete. We will email you again once it is live.');
                break;

            case GlobalConstant::VERIFICATION_STATUS_APPROVED:
                $mail->subject('Your Bahali profile is now live')
                    ->line('Your profile has been verified and approved, and is now visible in the Bahali Provider Directory.')
                    ->action('View or update my profile', $editUrl);
                break;

            case GlobalConstant::VERIFICATION_STATUS_REJECTED:
                $mail->subject('Update on your Bahali profile submission')
                    ->line('We were not able to accept your profile for the Bahali Provider Directory.')
                    ->line('Reason: ' . ($this->reasonLabel ?: 'See the note below.'));
                if ($this->note) {
                    $mail->line($this->note);
                }
                $mail->line('If you believe this decision was made in error, you can request reconsideration.');
                if ($support) {
                    $subject = rawurlencode('Reconsideration request — ' . ($this->provider->organization_name ?: 'provider profile'));
                    $mail->action('Request reconsideration', "mailto:{$support}?subject={$subject}");
                }
                break;

            default: // suspended / inactive
                $mail->subject('Update on your Bahali listing')
                    ->line('The status of your listing has changed to: ' . ucfirst(str_replace('_', ' ', $this->status)) . '.');
                if ($this->note) {
                    $mail->line($this->note);
                }
                break;
        }

        return $mail->salutation('— The Bahali team');
    }
}
