<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Bahali Connect blog (BLOG_AND_GET_HELP.md → "CMS module to implement").
 * Only status published/scheduled with published_at in the past is public.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('summary');                                   // card + article introduction
            $table->string('category', 60);                            // Taking the first step | Finding your fit | Supporting someone | For Providers
            $table->json('reading_paths')->nullable();                 // also listed under these categories (e.g. Supporting someone)
            $table->longText('body');                                  // Markdown (rendered safely on the server)
            $table->string('image')->nullable();                       // optional photo after the opening
            $table->string('image_alt')->nullable();
            $table->string('author_name')->nullable();                 // only real contributor details
            $table->string('author_role')->nullable();
            $table->string('reviewer_name')->nullable();               // shown only when a clinical review was completed
            $table->date('reviewed_at')->nullable();
            $table->string('margin_quote')->nullable();                // "A thought to keep close"
            $table->string('cta_label')->nullable();                   // closing button (default: Find support on Bahali Connect)
            $table->string('cta_url')->nullable();
            $table->string('signoff', 60)->nullable();                 // "With care,"
            $table->string('signature', 60)->nullable();               // "Marsha"
            $table->json('related_post_ids')->nullable();              // explicit related articles
            $table->boolean('is_featured')->default(false);            // lead story on /blog (one)
            $table->boolean('on_homepage')->default(false);            // "Start with understanding." on the homepage
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 300)->nullable();
            $table->string('status', 20)->default('draft')->index();   // draft | in_review | approved | scheduled | published | archived
            $table->timestamp('published_at')->nullable()->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // A changed slug keeps working: the old address redirects to the article.
        Schema::create('blog_post_redirects', function (Blueprint $table) {
            $table->id();
            $table->string('old_slug')->unique();
            $table->foreignId('blog_post_id')->constrained('blog_posts')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_post_redirects');
        Schema::dropIfExists('blog_posts');
    }
};
