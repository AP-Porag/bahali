<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * When the last "please confirm your availability" email went out, so the daily
 * reminder command sends one email per 60-day cycle instead of one every day.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            if (! Schema::hasColumn('providers', 'availability_reminder_sent_at')) {
                $table->timestamp('availability_reminder_sent_at')->nullable()->after('availability_confirmed_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            if (Schema::hasColumn('providers', 'availability_reminder_sent_at')) {
                $table->dropColumn('availability_reminder_sent_at');
            }
        });
    }
};
