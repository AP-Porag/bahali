<?php

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
            $table->string('name')->nullable();
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->enum('verification_status', [
                GlobalConstant::VERIFICATION_STATUS_APPROVED,
                GlobalConstant::VERIFICATION_STATUS_REJECTED,
                GlobalConstant::VERIFICATION_STATUS_PROVISIONAL,
            ])->nullable();
            $table->foreignId('provider_type_id')->nullable();

            $table->string('region')->nullable();
            $table->string('service')->nullable();

            $table->enum('status', [
                GlobalConstant::STATUS_DRAFT,
                GlobalConstant::STATUS_PENDING,
                GlobalConstant::STATUS_VERIFIED,
                GlobalConstant::STATUS_SUSPENDED,
                GlobalConstant::STATUS_EXPIRED,
            ])->default(GlobalConstant::STATUS_DRAFT);

            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('avatar')->nullable();

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
