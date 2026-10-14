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
 *
 * Uses the Bahali email template: resources/views/emails/provider/review-outcome.blade.php
 * (+ a plain-text version for clients that don't show HTML).
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

        // Shared defaults — each outcome below fills in its own text.
        $data = [
            'eyebrow'      => 'Profile review',
            'eyebrowColor' => '#0E7C7B',
            'intro'        => [],
            'statusRows'   => [],
            'note'         => $this->note,
            'noteLabel'    => 'Note from the Bahali team',
            'actionUrl'    => null,
            'actionText'   => null,
            'beforeAction' => [],   // text that belongs right above the button
            'outro'        => [],
        ];

        switch ($this->status) {
            case ProviderService::STATUS_NEEDS_CORRECTION:
                $subject = 'Action needed: please update your Bahali profile';
                $data = array_merge($data, [
                    'eyebrow'      => 'Action needed',
                    'eyebrowColor' => '#B7791F',
                    'heading'      => 'A few updates are needed',
                    'preheader'    => 'A few things on your profile need to be updated before review can continue.',
                    'intro'        => ['Thank you for submitting your profile to the Bahali Provider Directory. Before we can continue, a few things need to be updated:'],
                    'note'         => $this->note ?: 'Please review your profile for missing or unclear information.',
                    'noteLabel'    => 'What to update',
                    'actionUrl'    => $editUrl,
                    'actionText'   => 'Update my profile',
                    'outro'        => ['Once you save your changes, your profile goes back into review.'],
                ]);
                break;

            case ProviderService::STATUS_PENDING_VERIFICATION:
                $subject = 'Your Bahali profile passed the initial review';
                $data = array_merge($data, [
                    'heading'   => 'Your profile passed the initial review',
                    'preheader' => 'Your profile has moved to verification.',
                    'intro'     => [
                        'Your profile passed our initial review and has moved to verification.',
                        'It will stay unpublished until verification and final approval are complete. We will email you again once it is live.',
                    ],
                    'statusRows' => [['label' => 'Current stage', 'value' => 'Pending verification']],
                ]);
                break;

            case GlobalConstant::VERIFICATION_STATUS_APPROVED:
                $subject = 'Your Bahali profile is now live';
                $data = array_merge($data, [
                    'eyebrow'    => 'Approved',
                    'heading'    => 'Your profile is now live',
                    'preheader'  => 'Your profile is now visible in the Bahali Provider Directory.',
                    'intro'      => ['Your profile has been verified and approved, and is now visible in the Bahali Provider Directory.'],
                    'actionUrl'  => $editUrl,
                    'actionText' => 'View or update my profile',
                ]);
                break;

            case GlobalConstant::VERIFICATION_STATUS_REJECTED:
                $subject = 'Update on your Bahali profile submission';
                $reconsider = null;
                if ($support) {
                    $mailSubject = rawurlencode('Reconsideration request — ' . ($this->provider->organization_name ?: 'provider profile'));
                    $reconsider  = "mailto:{$support}?subject={$mailSubject}";
                }
                $data = array_merge($data, [
                    'heading'    => 'Update on your profile submission',
                    'preheader'  => 'We were not able to accept your profile.',
                    'intro'      => ['We were not able to accept your profile for the Bahali Provider Directory.'],
                    'statusRows' => [['label' => 'Reason', 'value' => $this->reasonLabel ?: 'See the note below.']],
                    'actionUrl'  => $reconsider,
                    'actionText'   => 'Request reconsideration',
                    'beforeAction' => ['If you believe this decision was made in error, you can request reconsideration.'],
                ]);
                break;

            default: // suspended / inactive
                $subject = 'Update on your Bahali listing';
                $statusLabel = ucfirst(str_replace('_', ' ', $this->status));
                $data = array_merge($data, [
                    'heading'    => 'Your listing status has changed',
                    'preheader'  => "Your listing status is now: {$statusLabel}.",
                    'intro'      => ['The status of your listing has changed.'],
                    'statusRows' => [['label' => 'New status', 'value' => $statusLabel]],
                ]);
                break;
        }

        // Amber note box for corrections, neutral beige for everything else.
        $amber = $this->status === ProviderService::STATUS_NEEDS_CORRECTION;
        $data += [
            'noteBg'         => $amber ? '#FDF5E4' : '#FBF8F2',
            'noteBorder'     => $amber ? '#F3D9A4' : '#EFEAE0',
            'noteAccent'     => $amber ? '#E8B84B' : '#0E7C7B',
            'noteLabelColor' => $amber ? '#7A5410' : '#5B6B6E',
        ];

        return (new MailMessage)
            ->subject($subject)
            ->view(
                ['emails.provider.review-outcome', 'emails.provider.review-outcome-text'],
                $data + ['subject' => $subject, 'name' => $name, 'support' => $support]
            );
    }
}
