<?php
// database/migrations/2026_10_13_000000_make_location_and_identity_nullable_on_providers.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The registration form changed:
     *  - city / parish are picked from the selected country's list, so `city` is empty for most
     *    countries and `state_province` is empty for countries with no list;
     *  - the "Do you identify as part of the Caribbean community?" question was removed.
     * These columns were NOT NULL, so new providers could not be saved.
     */
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->string('city')->nullable()->change();
            $table->string('state_province')->nullable()->change();
            $table->string('caribbean_identity')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->string('city')->nullable(false)->change();
            $table->string('state_province')->nullable(false)->change();
            $table->string('caribbean_identity')->nullable(false)->change();
        });
    }
};
