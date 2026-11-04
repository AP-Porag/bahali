<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;

/**
 * Bahali-styled "Reset your password" email.
 *
 * Laravel's built-in ResetPassword notification sends this through
 * ResetPassword::toMailUsing(...) in AppServiceProvider::boot().
 * Template: resources/views/emails/auth/reset-password.blade.php (+ plain-text version).
 */
class BahaliResetPasswordMail
{
    public static function build(object $notifiable, string $token): MailMessage
    {
        // Same link Laravel builds by default: /reset-password/{token}?email=...
        $url = url(route('password.reset', [
            'token' => $token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        $minutes = (int) config('auth.passwords.' . config('auth.defaults.passwords') . '.expire', 60);
        $subject = 'Reset your Bahali password';

        return (new MailMessage)
            ->subject($subject)
            ->view(['emails.auth.reset-password', 'emails.auth.reset-password-text'], [
                'subject'   => $subject,
                'name'      => $notifiable->name ?: 'there',
                'actionUrl' => $url,
                'minutes'   => $minutes,
            ]);
    }
}
