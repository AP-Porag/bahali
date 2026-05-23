<?php

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
        Schema::create('region_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // e.g. Parish, State, Province, Department, District, Municipality

            $table->string('label');
            // UI label override: "Select Parish", "Select State"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('region_types');
    }
};
