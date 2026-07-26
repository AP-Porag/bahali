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
            $table->string('area')->nullable(); // null allowed
            $table->string('area_other')->nullable();
            $table->timestamps();

            // ইউনিক কনস্ট্রেইন্ট (সম্পূর্ণ তিনটি কলাম মিলিয়ে)
            $table->unique(['provider_id', 'area', 'area_other']);

            // ইনডেক্স (সার্চের জন্য)
            $table->index('category');
            $table->index('area');
            $table->index('area_other');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('provider_support_areas');
    }
};
