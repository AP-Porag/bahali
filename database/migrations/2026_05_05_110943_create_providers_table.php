<?php

use App\Enums\ProviderStatusEnum;
use App\Enums\VerificationStatusEnum;
use App\Utils\GlobalConstant;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('providers', function (Blueprint $table) {
            $table->id();

            // Basic identity
            $table->string('display_name');
            $table->string('organization_name')->nullable();
            $table->string('slug')->unique();

            // Bio
            $table->longText('bio')->nullable();

            // Contact
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();

            // Geography
            $table->foreignId('country_id')->nullable();
            $table->foreignId('region_id')->nullable();

            $table->string('region_type')->nullable();
            $table->string('city_or_community')->nullable();

            // Service
            $table->boolean('virtual_services_available')->default(false);
            $table->boolean('in_person_services_available')->default(false);

            // Address privacy
            $table->enum('address_visibility_preference', [
                'none',
                'city_region',
                'service_area',
                'full_address',
            ])->default('city_region');

            // Verification
            $table->enum('verification_status', [
                'pending_review',
                'verified_licensed',
                'verified_organization',
                'community_based',
                'faith_based',
                'not_verified',
                'hidden',
            ])->default('pending_review');

            // Lifecycle
            $table->enum('status', [
                'draft',
                'pending',
                'published',
                'suspended',
                'expired',
            ])->default('draft');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('providers');
    }
};
