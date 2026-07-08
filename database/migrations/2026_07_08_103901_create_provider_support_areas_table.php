<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('provider_support_areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')
                ->constrained('providers')
                ->cascadeOnDelete();
            $table->string('category');
            $table->string('area');
            $table->timestamps();

            $table->unique(['provider_id', 'area']);
            $table->index('category'); // browse-by-category
            $table->index('area');     // filter-by-area
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_support_areas');
    }
};
