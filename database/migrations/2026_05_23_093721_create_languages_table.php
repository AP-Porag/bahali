<?php
// database/migrations/2024_01_01_000010_create_languages_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 30)->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('provider_language', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();
            $table->foreignId('language_id')->constrained()->cascadeOnDelete();
            $table->enum('proficiency', ['native', 'fluent', 'advanced', 'intermediate', 'basic'])->default('fluent');
            $table->timestamps();

            $table->unique(['provider_id', 'language_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_language');
        Schema::dropIfExists('languages');
    }
};
