<?php

namespace App\Services\Web;

use App\Models\PageContent;
use App\Services\BaseService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class JoinTheCircleService extends BaseService
{
    public const PAGE = 'join-the-circle';

    private const CACHE_KEY = 'page_content_join_the_circle';

    private const UPLOAD_DIR = 'page-contents/join-the-circle';

    public function __construct()
    {
        parent::__construct(new PageContent());
    }

    /* ------------------------------------------------------------------ */
    /*  Schema — single source of truth for every editable field          */
    /*  type: text | textarea | image                                      */
    /*  Multi-line text: "\n" = line break on the public page.            */
    /* ------------------------------------------------------------------ */
    public static function schema(): array
    {
        $benefits = [
            ['Found by the diaspora', 'Families on the islands and abroad search for culturally grounded care. Your listing meets them where they look.'],
            ['Culturally matched referrals', 'Seekers filter by language, identity, and lived experience, so the people best suited to your strengths find you.'],
            ['A profile that holds your story', 'Bio, photo, languages, and how culture shapes your care — everything a family needs to feel safe choosing you.'],
            ['Language-first search', 'English, Haitian Creole, Patois, French, Spanish and more — families find you in the language they heal in.'],
            ['Telehealth across borders', 'Mark every region you can serve remotely. Reach clients across islands and time zones, not just your home parish.'],
            ['Verified & trusted', 'Every provider is reviewed. Your license and credentials are confirmed, so families trust the circle they step into.'],
            ['Free to be listed', 'No fees, no contracts. Bahali is a nonprofit — our aim is access to care, not gatekeeping it behind a paywall.'],
            ['You control your listing', 'Update your bio, availability, and the regions you serve any time. Your profile grows as your practice does.'],
            ['Community, not competition', 'Join a network built on care. We connect providers, programs, and faith leaders walking the same path with you.'],
        ];

        $testimonials = [
            ['Being listed meant diaspora families searching in two languages could finally find someone who understood both their worlds.', 'Kulman Jamm', 'Clinical Psychologist'],
            ['The referrals are people I’m actually equipped to help. The cultural filters do real work before a client reaches my inbox.', 'Joanne P.', 'Mental Health Counselor, LMHC'],
            ['I don’t have the time or skill to market myself online. Bahali put me in front of the exact community I trained to serve.', 'David R.', 'Clinical Social Worker'],
        ];

        $faqs = [
            ['How much does it cost to be listed?', 'Nothing. Bahali is a nonprofit and the directory is free for verified providers — no fees, no contracts. Our mission is widening access to culturally grounded care, not putting it behind a paywall.'],
            ['Who can join the directory?', 'Licensed and credentialed providers, support groups, faith-based organizations, and community programs who serve Caribbean individuals and families, on the islands or in the diaspora.'],
            ['Do I need to be Caribbean myself?', 'No. We welcome any provider with genuine experience supporting Caribbean communities. The form lets you share your background and cultural approach so seekers can decide what fits them.'],
            ['Can I offer telehealth across islands?', 'Yes. Your profile lets you list every region you can serve remotely, so families across borders and time zones can reach you.'],
        ];

        $mosaicDefaults = ['mosaic10', 'mosaic2', 'mosaic3', 'mosaic4', 'mosaic8', 'mosaic6', 'mosaic7', 'mosaic5', 'mosaic9', 'mosaic1'];

        /* ---------- Benefits fields ---------- */
        $benefitFields = [
            self::field('benefits.title', 'Section Heading', 'text', 'Bahali provider benefits'),
            self::field('benefits.subtitle', 'Section Subheading', 'text', 'No fees, no contracts. Free for every verified provider.'),
        ];
        foreach ($benefits as $i => [$title, $body]) {
            $n = $i + 1;
            $benefitFields[] = self::field("benefits.item_{$n}.title", 'Title', 'text', $title, "Benefit {$n}");
            $benefitFields[] = self::field("benefits.item_{$n}.body", 'Description', 'textarea', $body, "Benefit {$n}");
        }
        $benefitFields[] = self::field('benefits.cta', 'Button Text', 'text', 'Join the circle');

        /* ---------- Testimonial fields ---------- */
        $testimonialFields = [
            self::field('testimonials.title', 'Section Heading', 'text', 'Voices from the circle'),
            self::field('testimonials.image', 'Featured Portrait', 'image', '/images/join/testimonial.jpg', null, 'Portrait orientation works best (e.g. 800×1000).'),
        ];
        foreach ($testimonials as $i => [$quote, $name, $role]) {
            $n = $i + 1;
            $testimonialFields[] = self::field("testimonials.item_{$n}.quote", 'Quote', 'textarea', $quote, "Testimonial {$n}");
            $testimonialFields[] = self::field("testimonials.item_{$n}.name", 'Name', 'text', $name, "Testimonial {$n}");
            $testimonialFields[] = self::field("testimonials.item_{$n}.role", 'Role', 'text', $role, "Testimonial {$n}");
        }

        /* ---------- FAQ fields ---------- */
        $faqFields = [
            self::field('faq.title', 'Section Heading', 'text', 'Frequently asked questions'),
        ];
        foreach ($faqs as $i => [$q, $a]) {
            $n = $i + 1;
            $faqFields[] = self::field("faq.item_{$n}.question", 'Question', 'text', $q, "FAQ {$n}");
            $faqFields[] = self::field("faq.item_{$n}.answer", 'Answer', 'textarea', $a, "FAQ {$n}");
        }

        /* ---------- Mosaic fields ---------- */
        $mosaicFields = [
            self::field('mosaic.cta_title', 'CTA Title', 'text', 'Add your name to the circle'),
            self::field('mosaic.cta_subtitle', 'CTA Subtitle', 'text', 'Free for verified providers.'),
            self::field('mosaic.cta_button', 'CTA Button Text', 'text', 'Join us'),
        ];
        foreach ($mosaicDefaults as $i => $file) {
            $n = $i + 1;
            $mosaicFields[] = self::field("mosaic.image_{$n}", "Photo {$n}", 'image', "/images/join/{$file}.jpeg", 'Photos', 'Square images work best (e.g. 600×600).');
        }

        return [
            [
                'key' => 'seo',
                'title' => 'SEO & Meta',
                'description' => 'Browser tab title and the description search engines show.',
                'fields' => [
                    self::field('seo.title', 'Page Title', 'text', 'Join the Circle — Become a Bahali Wellness Provider'),
                    self::field('seo.description', 'Meta Description', 'textarea', 'Everything you need to be found by Caribbean families seeking culturally grounded care. Join the Bahali Provider Directory — free for verified providers, across the islands and the diaspora.'),
                ],
            ],
            [
                'key' => 'hero',
                'title' => 'Hero',
                'description' => 'The full-width banner at the top of the page.',
                'fields' => [
                    self::field('hero.image', 'Background Image', 'image', '/images/join/hero.jpg', null, 'Wide landscape image (min. 1920×900).'),
                    self::field('hero.eyebrow', 'Eyebrow', 'text', 'For Caribbean & diaspora-serving providers'),
                    self::field('hero.title', 'Heading', 'textarea', "Help Caribbean\nFamilies Find the\nCare They Need", null, 'Press Enter to add a line break.'),
                    self::field('hero.description', 'Description', 'textarea', "Join a trusted network helping Caribbean\nindividuals and families find culturally\ngrounded emotional wellness support.", null, 'Press Enter to add a line break.'),
                    self::field('hero.description_secondary', 'Second Paragraph', 'textarea', "Grow your professional presence while\nstrengthening access to care across our\ncommunities.", null, 'Press Enter to add a line break.'),
                    self::field('hero.cta_primary', 'Primary Button Text', 'text', 'Create Your Provider Profile'),
                    self::field('hero.cta_secondary', 'Secondary Button Text', 'text', 'Learn More'),
                ],
            ],
            [
                'key' => 'simple',
                'title' => 'It’s Simple to Join',
                'description' => 'Intro band below the hero.',
                'fields' => [
                    self::field('simple.title', 'Heading', 'text', 'It’s simple to join'),
                    self::field('simple.body', 'Description', 'textarea', 'Share your story today and step into the circle. You’ll appear before the Caribbean individuals and families who come to Bahali searching for someone who understands where they come from.'),
                    self::field('simple.cta', 'Button Text', 'text', 'Join now'),
                ],
            ],
            [
                'key' => 'benefits',
                'title' => 'Provider Benefits',
                'description' => 'The nine-item benefits grid.',
                'fields' => $benefitFields,
            ],
            [
                'key' => 'referrals',
                'title' => 'Referrals Showcase',
                'description' => 'Text and image block after the benefits.',
                'fields' => [
                    self::field('referrals.eyebrow', 'Eyebrow', 'text', 'The home of Caribbean referrals'),
                    self::field('referrals.title', 'Heading', 'text', 'The first place families look for care that feels like home'),
                    self::field('referrals.body', 'Description', 'textarea', 'Attract new clients and grow your practice when you join the directory built around Caribbean culture, language, and lived experience.'),
                    self::field('referrals.cta', 'Button Text', 'text', 'Join now'),
                    self::field('referrals.image', 'Image', 'image', '/images/join/referrals.jpg', null, 'Landscape or portrait (e.g. 1000×1000).'),
                ],
            ],
            [
                'key' => 'stat',
                'title' => 'Stat Band',
                'description' => 'The amber band with the big number.',
                'fields' => [
                    self::field('stat.number', 'Big Number', 'text', '28+'),
                    self::field('stat.description', 'Description', 'textarea', 'Caribbean regions and territories where families are searching for culturally grounded care — in 8+ languages.'),
                    self::field('stat.image_1', 'Portrait 1', 'image', '/images/join/stat1.jpeg', 'Portraits', 'Portrait orientation (3:4).'),
                    self::field('stat.image_2', 'Portrait 2', 'image', '/images/join/stat2.jpeg', 'Portraits', 'Portrait orientation (3:4).'),
                    self::field('stat.image_3', 'Portrait 3', 'image', '/images/join/stat3.jpeg', 'Portraits', 'Portrait orientation (3:4).'),
                ],
            ],
            [
                'key' => 'testimonials',
                'title' => 'Testimonials',
                'description' => 'Voices from the circle.',
                'fields' => $testimonialFields,
            ],
            [
                'key' => 'faq',
                'title' => 'FAQ',
                'description' => 'Two-column frequently asked questions.',
                'fields' => $faqFields,
            ],
            [
                'key' => 'mosaic',
                'title' => 'Photo Mosaic',
                'description' => 'Photo grid with the embedded call to action.',
                'fields' => $mosaicFields,
            ],
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Schema helpers                                                     */
    /* ------------------------------------------------------------------ */

    private static function field(
        string $key,
        string $label,
        string $type,
        string $default,
        ?string $group = null,
        ?string $hint = null
    ): array {
        return compact('key', 'label', 'type', 'default', 'group', 'hint');
    }

    /** Flat list of all fields keyed by field key. */
    public static function fields(): array
    {
        return collect(self::schema())
            ->flatMap(fn(array $section) => $section['fields'])
            ->keyBy('key')
            ->all();
    }

    public static function keys(): array
    {
        return array_keys(self::fields());
    }

    public static function fieldType(?string $key): ?string
    {
        if (! $key) {
            return null;
        }

        return self::fields()[$key]['type'] ?? null;
    }

    /* ------------------------------------------------------------------ */
    /*  Read                                                               */
    /* ------------------------------------------------------------------ */

    /** Public page content: defaults merged with saved values. */
    public function getContent(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            $defaults = collect(self::fields())
                ->mapWithKeys(fn(array $field) => [$field['key'] => $field['default']])
                ->all();

            $saved = PageContent::query()
                ->where('page', self::PAGE)
                ->whereIn('key', array_keys($defaults))
                ->pluck('value', 'key')
                ->filter(fn($value) => $value !== null && $value !== '')
                ->all();

            return array_merge($defaults, $saved);
        });
    }

    /** Admin view: schema sections with the current value on each field. */
    public function getAdminSections(): array
    {
        $content = $this->getContent();

        return collect(self::schema())
            ->map(function (array $section) use ($content) {
                $section['fields'] = collect($section['fields'])
                    ->map(fn(array $field) => [
                        'key' => $field['key'],
                        'label' => $field['label'],
                        'type' => $field['type'],
                        'group' => $field['group'],
                        'hint' => $field['hint'],
                        'value' => $content[$field['key']] ?? $field['default'],
                    ])
                    ->values()
                    ->all();

                return $section;
            })
            ->values()
            ->all();
    }

    /* ------------------------------------------------------------------ */
    /*  Write                                                              */
    /* ------------------------------------------------------------------ */

    public function updateText(string $key, string $value): void
    {
        $this->save($key, trim($value));
    }

    public function updateImage(string $key, UploadedFile $file): void
    {
        $old = $this->getContent()[$key] ?? null;

        // Read from the temp path directly — $file->store() relies on getRealPath(),
        // which returns false on some Windows setups ("Path cannot be empty").
        $path = self::UPLOAD_DIR . '/' . $file->hashName();
        $stream = fopen($file->getPathname(), 'r');

        Storage::disk('public')->put($path, $stream);

        if (is_resource($stream)) {
            fclose($stream);
        }

        $this->save($key, '/storage/' . $path);

        // Remove the previously uploaded file (never touches the default /images/join/* files)
        if ($old && str_starts_with($old, '/storage/' . self::UPLOAD_DIR . '/')) {
            Storage::disk('public')->delete(substr($old, strlen('/storage/')));
        }
    }

    private function save(string $key, string $value): void
    {
        PageContent::updateOrCreate(
            ['page' => self::PAGE, 'key' => $key],
            ['value' => $value]
        );

        Cache::forget(self::CACHE_KEY);
    }
}
