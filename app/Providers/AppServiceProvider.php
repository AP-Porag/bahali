<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Notifications\BahaliResetPasswordMail;
use Illuminate\Auth\Notifications\ResetPassword;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // ... apnar ager code jemon ache temon thakbe ...

        // Password reset email in the Bahali design.
        ResetPassword::toMailUsing(
            fn(object $notifiable, string $token) => BahaliResetPasswordMail::build($notifiable, $token)
        );
    }
}
