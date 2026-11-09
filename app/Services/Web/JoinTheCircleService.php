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

    private const CACHE_KEY = 'page_content_join_the_circle_v37'; // new key: the old cached content is never served

    private const UPLOAD_DIR = 'page-contents/join-the-circle';

    public function __construct()
    {
        parent::__construct(new PageContent());
    }

    /* ------------------------------------------------------------------ */
    /*  Schema — single source of truth for every editable field          */
    /*  type: text | textarea | image                                      */
    /*  Landing page Version 3.7 (Marsha's approved design). Keys start    */
    /*  with "landing." so values saved for the old Join the Circle page   */
    /*  are never shown on the new page. Defaults = the approved text.     */
    /*  Keep in sync with DEFAULTS in resources/js/pages/web/JoinTheCircle.tsx */
    /* ------------------------------------------------------------------ */
    public static function schema(): array
    {
        return [
            [
                'key' => 'landing_seo',
                'title' => 'Page title & link previews',
                'description' => 'Browser tab title, search description and the text/image shown when the page link is shared.',
                'fields' => [
                    self::field('landing.seo.title', 'Browser tab title', 'text', 'Join the Bahali Provider Directory | Bahali'),
                    self::field('landing.seo.description', 'Search engine description', 'textarea', 'Join the Bahali Provider Directory and help individuals and families across Caribbean communities and the diaspora discover the mental health and emotional wellness support you offer.'),
                    self::field('landing.seo.share_title', 'Link preview title', 'text', 'Make meaningful support easier to find.', 'Link previews (WhatsApp, Facebook, LinkedIn, X)'),
                    self::field('landing.seo.share_description', 'Link preview description', 'textarea', 'Join a growing directory connecting individuals and families with mental health and emotional wellness providers across the Caribbean and its diaspora.', 'Link previews (WhatsApp, Facebook, LinkedIn, X)'),
                    self::field('landing.seo.share_image', 'Link preview image (1200 × 630 px)', 'image', '/images/landing/social-share.jpg', 'Link previews (WhatsApp, Facebook, LinkedIn, X)', '1200 × 630 px JPG. Shown when the page link is shared.'),
                ],
            ],
            [
                'key' => 'landing_header',
                'title' => 'Header menu',
                'description' => 'Links at the top of the landing page.',
                'fields' => [
                    self::field('landing.header.link_1', 'Menu link 1', 'text', 'Our purpose'),
                    self::field('landing.header.link_2', 'Menu link 2', 'text', 'How People Find Support'),
                    self::field('landing.header.link_3', 'Menu link 3', 'text', 'How to join'),
                    self::field('landing.header.button', 'Menu button', 'text', 'Apply to join →'),
                ],
            ],
            [
                'key' => 'landing_hero',
                'title' => 'Hero',
                'description' => 'Top of the page.',
                'fields' => [
                    self::field('landing.hero.eyebrow', 'Eyebrow label', 'text', 'JOIN THE BAHALI PROVIDER DIRECTORY'),
                    self::field('landing.hero.title', 'Heading', 'text', 'Make meaningful support easier to find.'),
                    self::field('landing.hero.body', 'Paragraph', 'textarea', 'Across the Caribbean and its diaspora, finding emotional wellness support is not always straightforward. Bahali is building a directory that helps individuals and families discover the services you offer, in the locations where you provide support.'),
                    self::field('landing.hero.emphasis', 'Highlighted paragraph', 'textarea', 'We welcome providers from diverse professional and community-based backgrounds with experience providing mental health or emotional wellness support.'),
                    self::field('landing.hero.button', 'Button', 'text', 'Apply to join the directory →'),
                    self::field('landing.hero.link', 'Text link', 'text', 'Learn more'),
                    self::field('landing.hero.image', 'Photo (at least 1600 px wide, JPG under 300 KB)', 'image', '/images/landing/hero.jpg', 'Photo', 'Crop out anything distracting at the bottom. The page keeps both faces in view (object-position 27% 40%).'),
                    self::field('landing.hero.image_alt', 'Photo description (alt text)', 'text', 'A provider listens attentively to a client during a conversation in a bright room.', 'Photo'),
                ],
            ],
            [
                'key' => 'landing_purpose',
                'title' => 'Why Bahali exists',
                'description' => null,
                'fields' => [
                    self::field('landing.purpose.image', 'Photo (at least 1200 px wide, JPG under 300 KB)', 'image', '/images/landing/community.jpg', 'Photo', 'Landscape photo; shown with rounded corners.'),
                    self::field('landing.purpose.image_alt', 'Photo description (alt text)', 'text', 'Two women laughing together on a park bench, one resting her arm along the bench beside the other.', 'Photo'),
                    self::field('landing.purpose.eyebrow', 'Eyebrow label', 'text', 'WHY BAHALI EXISTS', 'Text'),
                    self::field('landing.purpose.title', 'Heading', 'text', 'Support should be easier to discover, wherever home may be.', 'Text'),
                    self::field('landing.purpose.body', 'Paragraph', 'textarea', 'Across Caribbean communities and the diaspora, finding appropriate mental health and emotional wellness support can be difficult. Distance, limited local options and uncertainty about where to turn can make that search even harder. By bringing information about providers and their services into one place, Bahali helps individuals and families discover available support while making the work of participating providers easier to find.', 'Text'),
                    self::field('landing.purpose.quote', 'Quote', 'textarea', 'A directory designed around people\'s needs, locations and preferences—not around one profession.', 'Text'),
                ],
            ],
            [
                'key' => 'landing_search',
                'title' => 'How people find support',
                'description' => 'Text beside the search preview, and the preview card itself.',
                'fields' => [
                    self::field('landing.search.eyebrow', 'Eyebrow label', 'text', 'HOW PEOPLE FIND SUPPORT', 'Text'),
                    self::field('landing.search.title', 'Heading', 'text', 'Help people discover the support you offer.', 'Text'),
                    self::field('landing.search.body_1', 'Paragraph 1', 'textarea', 'People can explore options by location, area of support, language and how services are delivered, including in person and virtually.', 'Text'),
                    self::field('landing.search.body_2', 'Paragraph 2', 'textarea', 'The search experience begins with what someone needs—not with a requirement to know which type of provider to approach.', 'Text'),
                    self::field('landing.search.card_title', 'Card heading', 'text', 'Find support', 'Search preview card'),
                    self::field('landing.search.field_1_label', 'Field 1 label', 'text', 'Location', 'Search preview card'),
                    self::field('landing.search.field_1_text', 'Field 1 text', 'text', 'Select your location', 'Search preview card'),
                    self::field('landing.search.field_2_label', 'Field 2 label', 'text', 'Area of support', 'Search preview card'),
                    self::field('landing.search.field_2_text', 'Field 2 text', 'text', 'What would you like help with?', 'Search preview card'),
                    self::field('landing.search.field_3_label', 'Field 3 label', 'text', 'Language spoken', 'Search preview card'),
                    self::field('landing.search.field_3_text', 'Field 3 text', 'text', 'Select a language', 'Search preview card'),
                    self::field('landing.search.chips_label', 'Chips label', 'text', 'Example areas of support', 'Search preview card'),
                    self::field('landing.search.chip_1', 'Chip 1', 'text', 'Anxiety & Worry', 'Search preview card'),
                    self::field('landing.search.chip_2', 'Chip 2 (shown as selected)', 'text', 'Grief & Loss', 'Search preview card'),
                    self::field('landing.search.chip_3', 'Chip 3', 'text', 'Relationships & Family', 'Search preview card'),
                    self::field('landing.search.option_1', 'Tick option 1', 'text', 'In-person support', 'Search preview card'),
                    self::field('landing.search.option_2', 'Tick option 2', 'text', 'Virtual support', 'Search preview card'),
                    self::field('landing.search.button', 'Button', 'text', 'Explore support →', 'Search preview card'),
                ],
            ],
            [
                'key' => 'landing_shared',
                'title' => 'One shared purpose',
                'description' => null,
                'fields' => [
                    self::field('landing.shared.eyebrow', 'Eyebrow label', 'text', 'ONE SHARED PURPOSE'),
                    self::field('landing.shared.title', 'Heading', 'text', 'Different forms of support. Equal respect.'),
                    self::field('landing.shared.body', 'Paragraph', 'textarea', 'Supporting emotional wellness requires different kinds of knowledge, experience and care. Bahali brings together eligible clinical, counselling, pastoral, peer, allied and community-based providers, recognising their distinct contributions while clearly presenting the roles, qualifications and services they describe in their profiles.'),
                    self::field('landing.shared.item_1.title', 'Title', 'text', 'Local relevance', 'Point 1'),
                    self::field('landing.shared.item_1.body', 'Text', 'textarea', 'Discover support available in the locations where people live.', 'Point 1'),
                    self::field('landing.shared.item_2.title', 'Title', 'text', 'Informed choice', 'Point 2'),
                    self::field('landing.shared.item_2.body', 'Text', 'textarea', 'Explore provider-reported roles, qualifications and services before reaching out.', 'Point 2'),
                    self::field('landing.shared.item_3.title', 'Title', 'text', 'Multiple pathways', 'Point 3'),
                    self::field('landing.shared.item_3.body', 'Text', 'textarea', 'Explore different forms of support based on individual needs and preferences.', 'Point 3'),
                ],
            ],
            [
                'key' => 'landing_why',
                'title' => 'Why join Bahali',
                'description' => 'Point 6 is shown with the coral accent line.',
                'fields' => [
                    self::field('landing.why.eyebrow', 'Eyebrow label', 'text', 'WHY JOIN BAHALI'),
                    self::field('landing.why.title', 'Heading', 'text', 'Make what you offer easier to discover.'),
                    self::field('landing.why.item_1.title', 'Title', 'text', 'Be found by location', 'Point 1'),
                    self::field('landing.why.item_1.body', 'Text', 'textarea', 'Help people discover your services where you are available.', 'Point 1'),
                    self::field('landing.why.item_2.title', 'Title', 'text', 'Explain your services', 'Point 2'),
                    self::field('landing.why.item_2.body', 'Text', 'textarea', 'Give individuals a clearer understanding of the support you provide.', 'Point 2'),
                    self::field('landing.why.item_3.title', 'Title', 'text', 'Show service options', 'Point 3'),
                    self::field('landing.why.item_3.body', 'Text', 'textarea', 'Make it easy to identify whether you offer in-person or virtual support.', 'Point 3'),
                    self::field('landing.why.item_4.title', 'Title', 'text', 'Present your experience', 'Point 4'),
                    self::field('landing.why.item_4.body', 'Text', 'textarea', 'Share your qualifications, background and relevant experience.', 'Point 4'),
                    self::field('landing.why.item_5.title', 'Title', 'text', 'Keep information current', 'Point 5'),
                    self::field('landing.why.item_5.body', 'Text', 'textarea', 'Maintain an accurate representation of your services and availability.', 'Point 5'),
                    self::field('landing.why.item_6.title', 'Title', 'text', 'No directory listing fee', 'Point 6'),
                    self::field('landing.why.item_6.body', 'Text', 'textarea', 'Join the directory and maintain an approved profile at no cost.', 'Point 6'),
                ],
            ],
            [
                'key' => 'landing_steps',
                'title' => 'How to join',
                'description' => null,
                'fields' => [
                    self::field('landing.steps.eyebrow', 'Eyebrow label', 'text', 'HOW TO JOIN'),
                    self::field('landing.steps.title', 'Heading', 'text', 'A clear application process.'),
                    self::field('landing.steps.item_1.title', 'Title', 'text', 'Share your information', 'Step 01'),
                    self::field('landing.steps.item_1.body', 'Text', 'textarea', 'Tell us about your role, services, experience and locations.', 'Step 01'),
                    self::field('landing.steps.item_2.title', 'Title', 'text', 'Application review', 'Step 02'),
                    self::field('landing.steps.item_2.body', 'Text', 'textarea', 'Bahali reviews your application to determine whether your profile meets the directory\'s eligibility criteria and standards.', 'Step 02'),
                    self::field('landing.steps.item_3.title', 'Title', 'text', 'Become discoverable', 'Step 03'),
                    self::field('landing.steps.item_3.body', 'Text', 'textarea', 'Once approved, your profile is published in the directory, making your services discoverable through relevant searches.', 'Step 03'),
                ],
            ],
            [
                'key' => 'landing_faq',
                'title' => 'Frequently asked questions',
                'description' => 'The first question is shown open.',
                'fields' => [
                    self::field('landing.faq.eyebrow', 'Eyebrow label', 'text', 'GOOD TO KNOW'),
                    self::field('landing.faq.title', 'Heading', 'text', 'Frequently asked questions.'),
                    self::field('landing.faq.item_1.question', 'Question', 'text', 'Who can apply?', 'Question 1'),
                    self::field('landing.faq.item_1.answer', 'Answer', 'textarea', 'Eligible providers across clinical, counselling, pastoral, peer, allied and community-based support may apply. Requirements vary by role and services offered.', 'Question 1'),
                    self::field('landing.faq.item_2.question', 'Question', 'text', 'Do I need to be Caribbean to apply?', 'Question 2'),
                    self::field('landing.faq.item_2.answer', 'Answer', 'textarea', 'No. Bahali welcomes eligible providers from all backgrounds.', 'Question 2'),
                    self::field('landing.faq.item_3.question', 'Question', 'text', 'Do I need experience working with Caribbean communities?', 'Question 3'),
                    self::field('landing.faq.item_3.answer', 'Answer', 'textarea', 'No. Experience supporting Caribbean individuals, families or communities is not required. Providers who have this experience can indicate it in their profiles to help people make informed choices.', 'Question 3'),
                    self::field('landing.faq.item_4.question', 'Question', 'text', 'Must I offer virtual support?', 'Question 4'),
                    self::field('landing.faq.item_4.answer', 'Answer', 'textarea', 'No. Providers may offer in-person services, virtual services or both, depending on their services and applicable requirements.', 'Question 4'),
                    self::field('landing.faq.item_5.question', 'Question', 'text', 'How are applications reviewed?', 'Question 5'),
                    self::field('landing.faq.item_5.answer', 'Answer', 'textarea', 'Bahali reviews applications to assess whether providers meet the directory\'s eligibility criteria and standards. This includes reviewing the information submitted about their professional role, experience and services. Approval allows a profile to be published but does not constitute independent credential verification.', 'Question 5'),
                    self::field('landing.faq.item_6.question', 'Question', 'text', 'Is there a listing fee?', 'Question 6'),
                    self::field('landing.faq.item_6.answer', 'Answer', 'textarea', 'No. Applying to join the directory and maintaining an approved listing are free.', 'Question 6'),
                ],
            ],
            [
                'key' => 'landing_about',
                'title' => 'About Bahali',
                'description' => null,
                'fields' => [
                    self::field('landing.about.eyebrow', 'Eyebrow label', 'text', 'ABOUT BAHALI'),
                    self::field('landing.about.body', 'Statement', 'textarea', 'Bahali is a nonprofit organisation dedicated to emotional wellness across Caribbean communities and the diaspora. Founded and led by Dr. Marsha Smith, PsyD, LCSW, a clinical psychologist and clinical social worker, Bahali created the Provider Directory to help people find support and help providers be found.'),
                    self::field('landing.about.link_text', 'Link text', 'text', 'Learn more about Bahali →'),
                    self::field('landing.about.link_url', 'Link address', 'text', 'https://bahali.org/about/', null, 'Full address, starting with https://'),
                ],
            ],
            [
                'key' => 'landing_closing',
                'title' => 'Final invitation',
                'description' => 'Deep teal section at the bottom of the page.',
                'fields' => [
                    self::field('landing.closing.eyebrow', 'Eyebrow label', 'text', 'AN INVITATION TO PARTICIPATE'),
                    self::field('landing.closing.title', 'Heading', 'text', 'Help make support easier to find, wherever people call home.'),
                    self::field('landing.closing.body', 'Paragraph', 'textarea', 'Join Bahali in making information about emotional wellness support more accessible across Caribbean communities and the diaspora.'),
                    self::field('landing.closing.button', 'Button', 'text', 'Apply to join the directory →'),
                ],
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
