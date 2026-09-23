<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Legacy category → canonical category mapping
        DB::table('provider_support_areas')
            ->where('category', 'Emotional & Mental Health')
            ->update(['category' => 'Mental & Emotional Well-Being']);

        DB::table('provider_support_areas')
            ->where('category', 'Children, Teens & Parenting')
            ->update(['category' => 'Children, Teens & Families']);
    }

    public function down(): void
    {
        DB::table('provider_support_areas')
            ->where('category', 'Mental & Emotional Well-Being')
            ->whereIn('provider_id', [13])
            ->update(['category' => 'Emotional & Mental Health']);
    }
};
