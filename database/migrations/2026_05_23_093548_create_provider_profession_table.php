<?php
// database/migrations/2024_01_01_000007_create_provider_profession_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provider_profession', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->foreignId('provider_profession_id')->constrained('provider_professions')->cascadeOnDelete();
            $table->boolean('is_primary')->default(false);
            $table->string('custom_profession')->nullable(); // For "Other" selections
            $table->boolean('requires_admin_review')->default(false);
            $table->timestamps();

            $table->unique(['provider_id', 'provider_profession_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_profession');
    }
};
