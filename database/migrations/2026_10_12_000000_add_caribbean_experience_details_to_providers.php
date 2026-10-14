<?php
// database/migrations/2026_10_12_000000_add_caribbean_experience_details_to_providers.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            // Optional provider-written description shown under "Experience with Caribbean communities"
            // (labelled "Provider-reported"). Only kept when caribbean_experience = yes.
            $table->text('caribbean_experience_details')->nullable()->after('caribbean_experience');
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn('caribbean_experience_details');
        });
    }
};
