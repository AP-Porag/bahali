<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogPostRedirect;
use App\Services\Web\BlogRenderer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Bahali Connect blog — /blog and /blog/{slug} (reference BlogPages.jsx).
 * Only published records are public: drafts, review copies, future scheduled and archived posts return 404.
 */
class BlogController extends Controller
{
    public function __construct(private BlogRenderer $renderer)
    {
    }

    public function index(): Response
    {
        $posts = BlogPost::published()->orderByDesc('published_at')->orderBy('id')->get();
        $featured = $posts->firstWhere('is_featured', true) ?? $posts->first(fn ($p) => $p->category !== 'For Providers');
        $providerStory = $posts->first(fn ($p) => $p->category === 'For Providers');

        return Inertia::render('connect/Blog', [
            // Cards, category filter and search run in the browser, so search words never enter the page address.
            'posts'         => $posts->map(fn (BlogPost $p) => $this->card($p, true))->values(),
            'featured'      => $featured ? $this->card($featured) + ['authorName' => $featured->author_name, 'authorRole' => $this->shortRole($featured->author_role)] : null,
            'providerStory' => $providerStory ? $this->card($providerStory) : null,
        ]);
    }

    public function show(string $slug): Response|RedirectResponse
    {
        $post = BlogPost::published()->where('slug', $slug)->first();

        if (! $post) {
            // Changed address → current article (only if that article is public).
            $redirect = BlogPostRedirect::where('old_slug', $slug)->first();
            if ($redirect && $redirect->post && $redirect->post->isPublic()) {
                return redirect()->route('connect.blog.show', $redirect->post->slug, 301);
            }
            abort(404);
        }

        $rendered = $this->renderer->render($post->body);
        $provider = $post->category === 'For Providers';

        return Inertia::render('connect/Article', [
            'post' => [
                'slug'           => $post->slug,
                'title'          => $post->title,
                'category'       => $post->categoryLabel(),
                'summary'        => $post->summary,
                'provider'       => $provider,
                'authorName'     => $post->author_name,
                'authorRole'     => $post->author_role,
                'authorInitials' => $this->initials($post->author_name),
                'reviewerName'   => $post->reviewer_name,
                'reviewedAt'     => $post->reviewer_name && $post->reviewed_at ? $post->reviewed_at->format('F j, Y') : null,
                'publishedAt'    => $post->published_at->toDateString(),
                'publishedLabel' => $post->published_at->format('F j, Y'),
                'minutes'        => $rendered['minutes'],
                'image'          => $this->imageUrl($post->image),
                'imageAlt'       => $post->image_alt,
                'opening'        => $rendered['opening'],
                'sections'       => $rendered['sections'],
                'marginQuote'    => $post->margin_quote,
                'ctaLabel'       => $post->cta_label ?: 'Find support on Bahali Connect',
                'ctaUrl'         => $post->cta_url ?: '/get-help',
                'signoff'        => $post->signoff ?: 'With care,',
                'signature'      => $post->signature ?: ($post->author_name ? strtok($post->author_name, ' ,') : 'Bahali Connect'),
                'seoTitle'       => $post->seo_title ?: $post->title,
                'seoDescription' => $post->seo_description ?: $post->summary,
            ],
            'related' => $this->related($post, $provider),
        ]);
    }

    /** Explicit editorial choices first; otherwise same audience, same category first (reference rule). */
    private function related(BlogPost $post, bool $provider): array
    {
        $ids = array_filter((array) $post->related_post_ids);
        $chosen = $ids ? BlogPost::published()->whereIn('id', $ids)->get()->sortBy(fn ($p) => array_search($p->id, $ids))->values() : collect();

        if ($chosen->count() < 3) {
            $more = BlogPost::published()
                ->where('id', '!=', $post->id)
                ->whereNotIn('id', $chosen->pluck('id'))
                ->when($provider, fn ($q) => $q->where('category', 'For Providers'), fn ($q) => $q->where('category', '!=', 'For Providers'))
                ->orderByRaw('category = ? desc', [$post->category])
                ->orderByDesc('published_at')
                ->orderBy('id')
                ->limit(3 - $chosen->count())
                ->get();
            $chosen = $chosen->concat($more);
        }

        return $chosen->take(3)->map(fn (BlogPost $p) => $this->card($p))->values()->all();
    }

    /** Card fields; $withSearch adds the plain text used by the in-page search. */
    public function card(BlogPost $p, bool $withSearch = false): array
    {
        $text = $this->renderer->plainText($p->body);
        $card = [
            'id'           => $p->id,
            'slug'         => $p->slug,
            'title'        => $p->title,
            'category'     => $p->category,
            'categoryLabel' => $p->categoryLabel(),
            'readingPaths' => array_values((array) $p->reading_paths),
            'summary'      => $p->summary,
            'minutes'      => BlogRenderer::minutes($text),
        ];
        if ($withSearch) {
            $card['searchText'] = mb_strtolower($p->title . ' ' . $p->summary . ' ' . $text);
        }

        return $card;
    }

    private function imageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return str_starts_with($path, '/') || str_starts_with($path, 'http') ? $path : '/storage/' . ltrim($path, '/');
    }

    private function initials(?string $name): string
    {
        if (! $name) {
            return 'BC';
        }
        $words = array_filter(preg_split('/[\s,]+/', $name) ?: [], fn ($w) => preg_match('/^[A-Z][a-z]/', $w));

        return strtoupper(implode('', array_map(fn ($w) => mb_substr($w, 0, 1), array_slice(array_values($words), 0, 2)))) ?: 'BC';
    }

    /** "Founder and Executive Director, Bahali Inc." → "Founder, Bahali Inc." on the lead story card. */
    private function shortRole(?string $role): ?string
    {
        return $role ? preg_replace('/^Founder and Executive Director/', 'Founder', $role) : null;
    }
}
