<?php
// database/migrations/2024_01_01_000000_create_providers_table.php

use App\Utils\GlobalConstant;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // Basic
            $table->string('provider_type');
            $table->string('organization_name');
            $table->string('credentials')->nullable();
            $table->json('professional_title');
            $table->string('professional_title_other')->nullable();

            // About
            $table->text('short_bio');
            $table->string('years_experience')->nullable();

            // Licensure
            $table->string('license_number')->nullable();
            $table->json('license_states');
            $table->string('license_status');
            $table->string('verification_document')->nullable();

            // Populations (areas_of_support moved to provider_support_areas)
            $table->json('populations_served');

            // Culture & language
            $table->string('caribbean_identity');
            $table->string('caribbean_experience');
            $table->json('languages');
            $table->string('languages_other')->nullable();
            $table->text('cultural_approach')->nullable();

            // Service
            $table->json('service_formats');
            $table->json('practice_settings');

            // Location
            $table->string('address');
            $table->string('city');
            $table->string('state_province');
            $table->string('country');
            $table->string('multiple_locations');
            $table->boolean('hide_address')->default(false);
            $table->json('telehealth_regions')->nullable();
            $table->text('telehealth_regions_other')->nullable();

            // Payment
            $table->json('payment_methods');
            $table->text('insurance_plans')->nullable();

            // Contact
            $table->string('phone');
            $table->string('website')->nullable();
            $table->text('social_links')->nullable();

            // Media
            $table->string('profile_photo')->nullable();
            $table->json('additional_photos')->nullable();

            // Accessibility
            $table->json('accessibility');

            // Status
            $table->string('status')->default(GlobalConstant::VERIFICATION_STATUS_PENDING);

            // Note
            $table->text('note')->nullable();

            // Consent
            $table->boolean('consent_accurate')->default(false);
            $table->boolean('consent_notify')->default(false);
            $table->boolean('consent_no_endorsement')->default(false);
            $table->boolean('consent_public')->default(false);
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
