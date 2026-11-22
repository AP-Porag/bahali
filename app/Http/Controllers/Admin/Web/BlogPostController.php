<?php

namespace App\Http\Controllers\Admin\Web;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogPostRedirect;
use App\Services\Web\BlogRenderer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Admin → Website → Blog (BLOG_AND_GET_HELP.md → "CMS module to implement").
 * Draft → In review → Approved → Scheduled / Published → Archived. Administrators only (EnsureUserIsAdmin).
 */
class BlogPostController extends Controller
{
    public function index(): Response
    {
        $posts = BlogPost::query()
            ->orderByRaw("CASE status WHEN 'draft' THEN 1 WHEN 'in_review' THEN 2 WHEN 'approved' THEN 3 WHEN 'scheduled' THEN 4 WHEN 'published' THEN 5 ELSE 6 END")
            ->orderByDesc('updated_at')
            ->get(['id', 'title', 'slug', 'category', 'status', 'published_at', 'is_featured', 'on_homepage', 'updated_at'])
            ->map(fn (BlogPost $p) => [
                'id'          => $p->id,
                'title'       => $p->title,
                'slug'        => $p->slug,
                'category'    => $p->categoryLabel(),
                'status'      => $p->status,
                'statusLabel' => BlogPost::STATUSES[$p->status] ?? $p->status,
                'live'        => $p->isPublic(),
                'publishedAt' => $p->published_at?->format('M j, Y g:i a'),
                'updatedAt'   => $p->updated_at?->format('M j, Y g:i a'),
                'isFeatured'  => $p->is_featured,
                'onHomepage'  => $p->on_homepage,
            ]);

        return Inertia::render('admin/blog/index', ['posts' => $posts]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/blog/form', $this->formProps(new BlogPost([
            'category'  => 'Taking the first step',
            'status'    => 'draft',
            'signoff'   => 'With care,',
        ])));
    }

    public function edit(BlogPost $post): Response
    {
        return Inertia::render('admin/blog/form', $this->formProps($post));
    }

    public function store(Request $request): RedirectResponse
    {
        $post = new BlogPost(['created_by' => $request->user()->id]);
        $this->save($request, $post);

        return redirect()->route('admin.blog.edit', $post)->with('success', 'Article saved.');
    }

    public function update(Request $request, BlogPost $post): RedirectResponse
    {
        $this->save($request, $post);

        return redirect()->route('admin.blog.edit', $post)->with('success', 'Article saved.');
    }

    public function destroy(BlogPost $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('admin.blog.index')->with('success', 'Article deleted.');
    }

    /** Live preview: the same safe rendering the public article uses. */
    public function preview(Request $request, BlogRenderer $renderer): JsonResponse
    {
        $data = $request->validate(['body' => ['nullable', 'string', 'max:100000']]);

        return response()->json($renderer->render((string) ($data['body'] ?? '')));
    }

    /** Image inside an article: stored on the public disk, returns its address for the Markdown. */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate(['image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096']]);
        $path = $request->file('image')->store('blog', 'public');

        return response()->json(['url' => '/storage/' . $path]);
    }

    /* ------------------------------------------------------------------ */

    private function save(Request $request, BlogPost $post): void
    {
        $request->merge(['slug' => Str::slug((string) ($request->input('slug') ?: $request->input('title')))]);

        $data = $request->validate([
            'title'            => ['required', 'string', 'max:200'],
            'slug'             => ['required', 'string', 'max:200', Rule::unique('blog_posts', 'slug')->ignore($post->id),
                Rule::unique('blog_post_redirects', 'old_slug')->where(fn ($q) => $q->where('blog_post_id', '!=', $post->id ?? 0))],
            'summary'          => ['required', 'string', 'max:600'],
            'category'         => ['required', Rule::in(BlogPost::CATEGORIES)],
            'reading_paths'    => ['nullable', 'array'],
            'reading_paths.*'  => [Rule::in(BlogPost::CATEGORIES)],
            'body'             => ['required', 'string', 'max:100000'],
            'image_file'       => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_image'     => ['nullable', 'boolean'],
            'image_alt'        => ['nullable', 'string', 'max:300', 'required_with:image_file'],
            'author_name'      => ['nullable', 'string', 'max:150'],
            'author_role'      => ['nullable', 'string', 'max:200'],
            'reviewer_name'    => ['nullable', 'string', 'max:150'],
            'reviewed_at'      => ['nullable', 'date', 'required_with:reviewer_name'],
            'margin_quote'     => ['nullable', 'string', 'max:250'],
            'cta_label'        => ['nullable', 'string', 'max:80'],
            'cta_url'          => ['nullable', 'string', 'max:300', 'regex:#^(/|https://)#'],
            'signoff'          => ['nullable', 'string', 'max:60'],
            'signature'        => ['nullable', 'string', 'max:60'],
            'related_post_ids' => ['nullable', 'array', 'max:3'],
            'related_post_ids.*' => ['integer', 'exists:blog_posts,id'],
            'is_featured'      => ['nullable', 'boolean'],
            'on_homepage'      => ['nullable', 'boolean'],
            'seo_title'        => ['nullable', 'string', 'max:200'],
            'seo_description'  => ['nullable', 'string', 'max:300'],
            'status'           => ['required', Rule::in(array_keys(BlogPost::STATUSES))],
            'published_at'     => ['nullable', 'date', Rule::requiredIf(fn () => $request->input('status') === 'scheduled')],
        ], [
            'slug.unique'          => 'Another article already uses this address.',
            'image_alt.required_with' => 'Describe the photo for people who cannot see it.',
            'reviewed_at.required_with' => 'Add the date the clinical review was completed.',
            'cta_url.regex'        => 'Use a site address that starts with / or a full https:// address.',
            'published_at.required' => 'Choose when the article should be published.',
        ]);

        // Scheduled must be in the future; publishing now fills in the real time.
        if ($data['status'] === 'scheduled' && now()->gte($data['published_at'])) {
            throw ValidationException::withMessages(['published_at' => 'Choose a future date and time, or set the status to Published.']);
        }
        if ($data['status'] === 'published' && empty($data['published_at'])) {
            $data['published_at'] = $post->published_at ?? now();
        }

        DB::transaction(function () use ($request, $post, $data) {
            $oldSlug = $post->exists ? $post->getOriginal('slug') : null;

            if ($request->hasFile('image_file')) {
                $data['image'] = $request->file('image_file')->store('blog', 'public');
            } elseif ($request->boolean('remove_image')) {
                $data['image'] = null;
                $data['image_alt'] = null;
            }

            unset($data['image_file'], $data['remove_image']);
            $data['reading_paths'] = array_values(array_diff($data['reading_paths'] ?? [], [$data['category']]));
            $data['related_post_ids'] = array_values(array_map('intval', $data['related_post_ids'] ?? []));
            $data['is_featured'] = (bool) ($data['is_featured'] ?? false);
            $data['on_homepage'] = (bool) ($data['on_homepage'] ?? false);
            $data['reviewed_at'] = ! empty($data['reviewer_name']) ? ($data['reviewed_at'] ?? null) : null;
            $data['updated_by'] = $request->user()->id;

            $post->fill($data)->save();

            // Only one lead story on /blog.
            if ($post->is_featured) {
                BlogPost::where('id', '!=', $post->id)->where('is_featured', true)->update(['is_featured' => false]);
            }
            // Keep the old address working.
            if ($oldSlug && $oldSlug !== $post->slug) {
                BlogPostRedirect::updateOrCreate(['old_slug' => $oldSlug], ['blog_post_id' => $post->id]);
            }
            BlogPostRedirect::where('old_slug', $post->slug)->delete();
        });
    }

    private function formProps(BlogPost $post): array
    {
        return [
            'post' => [
                'id'               => $post->id,
                'title'            => $post->title ?? '',
                'slug'             => $post->slug ?? '',
                'summary'          => $post->summary ?? '',
                'category'         => $post->category,
                'reading_paths'    => array_values((array) $post->reading_paths),
                'body'             => $post->body ?? '',
                'image'            => $post->image ? (str_starts_with($post->image, '/') ? $post->image : '/storage/' . $post->image) : null,
                'image_alt'        => $post->image_alt ?? '',
                'author_name'      => $post->author_name ?? '',
                'author_role'      => $post->author_role ?? '',
                'reviewer_name'    => $post->reviewer_name ?? '',
                'reviewed_at'      => $post->reviewed_at?->toDateString() ?? '',
                'margin_quote'     => $post->margin_quote ?? '',
                'cta_label'        => $post->cta_label ?? '',
                'cta_url'          => $post->cta_url ?? '',
                'signoff'          => $post->signoff ?? '',
                'signature'        => $post->signature ?? '',
                'related_post_ids' => array_values((array) $post->related_post_ids),
                'is_featured'      => (bool) $post->is_featured,
                'on_homepage'      => (bool) $post->on_homepage,
                'seo_title'        => $post->seo_title ?? '',
                'seo_description'  => $post->seo_description ?? '',
                'status'           => $post->status ?? 'draft',
                'published_at'     => $post->published_at?->format('Y-m-d\TH:i') ?? '',
                'live'             => $post->exists && $post->isPublic(),
            ],
            'categories'  => collect(BlogPost::CATEGORY_LABELS)->map(fn ($label, $value) => ['value' => $value, 'label' => $label])->values(),
            'statuses'    => collect(BlogPost::STATUSES)->map(fn ($label, $value) => ['value' => $value, 'label' => $label])->values(),
            'otherPosts'  => BlogPost::where('id', '!=', $post->id ?? 0)->orderBy('title')->get(['id', 'title', 'status'])
                ->map(fn ($p) => ['id' => $p->id, 'title' => $p->title, 'status' => BlogPost::STATUSES[$p->status] ?? $p->status]),
        ];
    }
}
