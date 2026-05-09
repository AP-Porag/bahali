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

            /*
            |--------------------------------------------------------------------------
            | Basic Information
            |--------------------------------------------------------------------------
            */

            $table->string('name');
            // $table->string('slug')->unique();

            $table->string('email')->unique();
            $table->string('phone')->nullable();

            $table->text('bio')->nullable();

            $table->string('avatar')->nullable();

            $table->string('location')->nullable();
            $table->string('region')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Provider Type
            |--------------------------------------------------------------------------
            */

            $table->foreignId('provider_type_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Service Information
            |--------------------------------------------------------------------------
            | MVP stage এ string acceptable
            | Future এ pivot table করা যাবে
            |--------------------------------------------------------------------------
            */

            $table->string('service')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Governance / Visibility
            |--------------------------------------------------------------------------
            */

            $table->enum('status', [
                GlobalConstant::STATUS_DRAFT,
                GlobalConstant::STATUS_PENDING,
                GlobalConstant::STATUS_PUBLISHED,
                GlobalConstant::STATUS_SUSPENDED,
                GlobalConstant::STATUS_EXPIRED,
                GlobalConstant::STATUS_ARCHIVED,
            ])->default(GlobalConstant::STATUS_DRAFT);

            $table->enum('verification_status', [
                GlobalConstant::VERIFICATION_STATUS_UNVERIFIED,
                GlobalConstant::VERIFICATION_STATUS_VERIFIED,
                GlobalConstant::VERIFICATION_STATUS_PROVISIONAL,
                GlobalConstant::VERIFICATION_STATUS_REJECTED,
                GlobalConstant::VERIFICATION_STATUS_REVOKED,
                GlobalConstant::VERIFICATION_STATUS_EXPIRED,
            ])->default(GlobalConstant::VERIFICATION_STATUS_UNVERIFIED);

            /*
            |--------------------------------------------------------------------------
            | Public Visibility
            |--------------------------------------------------------------------------
            */

            $table->boolean('is_public')->default(false);

            /*
            |--------------------------------------------------------------------------
            | Governance Dates
            |--------------------------------------------------------------------------
            */

            $table->timestamp('verified_at')->nullable();

            $table->timestamp('published_at')->nullable();

            $table->timestamp('verification_expires_at')->nullable();

            $table->timestamp('suspended_at')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Governance Notes
            |--------------------------------------------------------------------------
            */

            $table->text('internal_notes')->nullable();

            $table->text('suspension_reason')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Audit / Tracking
            |--------------------------------------------------------------------------
            */

            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            /*
            |--------------------------------------------------------------------------
            | Laravel Defaults
            |--------------------------------------------------------------------------
            */

            $table->timestamps();

            $table->softDeletes();
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
