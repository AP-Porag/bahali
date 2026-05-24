<?php
// database/migrations/2024_01_01_000000_create_providers_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('providers', function (Blueprint $table) {
            $table->id();

            // Basic Information
            $table->string('provider_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();

            // Location Information
            $table->foreignId('country_id')->nullable()->constrained()->nullOnDelete();
            $table->string('region_type')->nullable();
            $table->string('region')->nullable();
            $table->string('city_town')->nullable();
            $table->string('service_area')->nullable();

            // Service Format
            $table->enum('service_format', ['home_office_private_residence', 'virtual_only_provider', 'mobile_community_based_provider', 'trauma_focused_service_location', 'dv_sa_support_location', 'youth_confidential_program', 'crisis_shelter_safety_sensitive_site'])->nullable();

            // Professional Information (JSON arrays)
            $table->json('professions')->nullable();
            $table->json('credentials')->nullable();
            $table->json('support_areas')->nullable();

            // Private Address Information
            $table->string('street_address1')->nullable();
            $table->string('street_address2')->nullable();
            $table->string('postal_code')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Admin Address Information
            $table->string('verification_address')->nullable();
            $table->string('billing_address')->nullable();

            // Address Visibility Settings
            $table->enum('address_visibility_preference', [
                'no_display',
                'city_region_only',
                'service_area',
                'full_address'
            ])->default('city_region_only');

            $table->boolean('location_sensitivity_flag')->default(false);

            // Application Status
            $table->enum('status', [
                'pending',
                'approved',
                'rejected',
                'suspended',
                'inactive'
            ])->default('pending');

            // Verification
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();

            // Timestamps and Soft Deletes
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('status');
            $table->index('service_format');
            $table->index('country_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
