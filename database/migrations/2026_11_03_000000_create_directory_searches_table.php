<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * One row per directory search (public provider directory), used by the admin dashboard:
 * Directory Searches, Zero-Result Searches, Search Demand by Location and Coverage Gaps.
 * No personal data is stored — only the filters and how many providers were found.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('directory_searches', function (Blueprint $table) {
            $table->id();
            $table->string('location', 120)->nullable()->index();   // country picked in the directory
            $table->string('region', 120)->nullable();               // parish / state
            $table->string('city', 120)->nullable();
            $table->json('areas')->nullable();                       // areas of support searched for
            $table->string('keyword', 160)->nullable();
            $table->boolean('include_virtual')->default(false);
            $table->unsignedInteger('results_count')->default(0);
            $table->timestamp('created_at')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('directory_searches');
    }
};
