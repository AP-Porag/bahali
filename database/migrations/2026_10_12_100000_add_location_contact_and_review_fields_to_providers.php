<?php
// database/migrations/2026_10_12_100000_add_location_contact_and_review_fields_to_providers.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            // Extra service locations: [{country, state_province, city}] picked from the lists.
            if (! Schema::hasColumn('providers', 'additional_locations')) {
                $table->json('additional_locations')->nullable()->after('multiple_locations');
            }
            // Provider decides whether the phone number is public (it is always required).
            if (! Schema::hasColumn('providers', 'show_phone')) {
                $table->boolean('show_phone')->default(true)->after('phone');
            }
            // Named contact person for organizations / churches / programs.
            if (! Schema::hasColumn('providers', 'contact_person_name')) {
                $table->string('contact_person_name')->nullable()->after('show_phone');
                $table->string('contact_person_role')->nullable()->after('contact_person_name');
                $table->string('contact_person_email')->nullable()->after('contact_person_role');
            }
            // Which rejection criterion was used (spam, out_of_scope, abusive, harmful, fraudulent).
            if (! Schema::hasColumn('providers', 'review_reason')) {
                $table->string('review_reason', 32)->nullable()->after('status');
            }
            // Used by the review screen and emails — created here only if it doesn't exist yet.
            if (! Schema::hasColumn('providers', 'note')) {
                $table->text('note')->nullable();
            }
            if (! Schema::hasColumn('providers', 'reviewed_at')) {
                $table->timestamp('reviewed_at')->nullable();
            }
        });

        // New review statuses (needs_correction, pending_verification) need a plain string
        // column — this also covers databases where `status` was created as an ENUM.
        Schema::table('providers', function (Blueprint $table) {
            $table->string('status', 32)->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropColumn([
                'additional_locations', 'show_phone',
                'contact_person_name', 'contact_person_role', 'contact_person_email',
                'review_reason',
            ]);
        });
    }
};
