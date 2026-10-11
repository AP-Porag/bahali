<?php
// database/migrations/2026_10_11_000000_add_fee_currency_and_reduced_cost_scope_to_providers.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            // ISO 4217 code shown beside the fee on cards, e.g. "USD", "JMD".
            $table->string('fee_currency', 3)->default('USD')->after('fee_range');
            // Whether the sliding scale / free–low-cost option applies to the displayed fee
            // ('this_service') or to other services/programs ('other_offerings').
            $table->string('reduced_cost_scope')->nullable()->after('fee_currency');
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn(['fee_currency', 'reduced_cost_scope']);
        });
    }
};
