<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Client review (25 Nov 2026) — "Welcome to Bahali Connect: Why We Created It", section "Why the first step matters":
 * the first two sentences are replaced; the rest of the paragraph stays the same.
 * Only changes the article when it still has the original wording (an edited article is left alone).
 */
return new class extends Migration
{
    private const OLD = 'In my years as a psychologist and clinical social worker, I have heard the same story many times. Someone is ready to talk to a professional, but they do not know where to start.';

    private const NEW = 'In my work as a psychologist and clinical social worker, I often hear from people who are ready to talk to a professional but do not know where to start.';

    public function up(): void
    {
        $this->swap(self::OLD, self::NEW);
    }

    public function down(): void
    {
        $this->swap(self::NEW, self::OLD);
    }

    private function swap(string $from, string $to): void
    {
        DB::table('blog_posts')
            ->where('slug', 'welcome-to-bahali-connect')
            ->where('body', 'like', '%' . $from . '%')
            ->get(['id', 'body'])
            ->each(fn ($post) => DB::table('blog_posts')
                ->where('id', $post->id)
                ->update(['body' => str_replace($from, $to, $post->body), 'updated_at' => now()]));
    }
};
