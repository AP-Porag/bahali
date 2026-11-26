<?php

namespace App\Services\Web;

/**
 * Bahali Connect — every editable text and image on the public website (Admin → CMS).
 *
 * Each default is the exact wording / image the page shipped with, so nothing changes on the site
 * until an editor saves a new value. Saved values live in page_contents (page = "connect-{page}").
 *
 * Field types: text (one line) · textarea (longer text) · image · markdown (policy pages).
 * Inline formatting in text/textarea: **bold**, *italic*, [link text](/address), new line = line break.
 */
class ConnectContentSchema
{
    public const FORMAT_HINT = 'Formatting: **bold**, *italic*, [link text](/address). A new line becomes a line break.';

    /** Page key → admin title, admin group, public address, short description. */
    public static function pages(): array
    {
        return [
            'home'          => ['title' => 'Home', 'group' => 'Main pages', 'url' => '/', 'description' => 'The visitor homepage.'],
            'help'          => ['title' => 'Get Help', 'group' => 'Main pages', 'url' => '/get-help', 'description' => 'The guided search page.'],
            'about'         => ['title' => 'About Connect', 'group' => 'Main pages', 'url' => '/about', 'description' => 'About Bahali Connect.'],
            'how'           => ['title' => 'How it works', 'group' => 'Main pages', 'url' => '/how-it-works', 'description' => 'How the directory works.'],
            'providers'     => ['title' => 'For Providers', 'group' => 'Main pages', 'url' => '/for-providers', 'description' => 'Provider recruitment page.'],
            'urgent'        => ['title' => 'Urgent Help', 'group' => 'Main pages', 'url' => '/urgent-help', 'description' => 'Urgent help information.'],
            'contact'       => ['title' => 'Contact', 'group' => 'Main pages', 'url' => '/contact', 'description' => 'The Contact form page.'],
            'report'        => ['title' => 'Report a concern', 'group' => 'Main pages', 'url' => '/report-a-concern', 'description' => 'The Report a concern form page.'],
            'blog'          => ['title' => 'Blog page', 'group' => 'Main pages', 'url' => '/blog', 'description' => 'Fixed text on the blog page and on every article. Articles themselves are edited in CMS → Blog.'],
            'privacy'       => ['title' => 'Privacy Policy', 'group' => 'Policy pages', 'url' => '/privacy', 'description' => 'Privacy Policy page.'],
            'terms'         => ['title' => 'Terms of Use', 'group' => 'Policy pages', 'url' => '/terms', 'description' => 'Terms of Use page.'],
            'directory'     => ['title' => 'Directory & Verification', 'group' => 'Policy pages', 'url' => '/directory-verification', 'description' => 'Directory & Verification page.'],
            'accessibility' => ['title' => 'Accessibility', 'group' => 'Policy pages', 'url' => '/accessibility', 'description' => 'Accessibility page.'],
            'spotlight'     => ['title' => 'Spotlight Policy', 'group' => 'Policy pages', 'url' => '/provider-spotlight-policy', 'description' => 'Provider Spotlight Policy page.'],
            'layout'        => ['title' => 'Header & Footer', 'group' => 'Site-wide', 'url' => '/', 'description' => 'Navigation, header and footer shown on every public page.'],
            'auth'          => ['title' => 'Login & Password', 'group' => 'Site-wide', 'url' => '/login', 'description' => 'Provider login, forgot password and reset password pages.'],
        ];
    }

    /** Sections (with fields) for one page. */
    public static function sections(string $page): array
    {
        return match ($page) {
            'home'          => self::home(),
            'help'          => self::help(),
            'about'         => self::about(),
            'how'           => self::how(),
            'providers'     => self::providers(),
            'urgent'        => self::urgent(),
            'contact'       => self::contact(),
            'report'        => self::report(),
            'blog'          => self::blog(),
            'privacy', 'terms', 'directory', 'accessibility' => self::policy($page),
            'spotlight'     => self::spotlight(),
            'layout'        => self::layout(),
            'auth'          => self::auth(),
            default         => [],
        };
    }

    /* ------------------------------------------------------------------ */
    /*  Helpers                                                            */
    /* ------------------------------------------------------------------ */

    private static function section(string $key, string $title, ?string $description, array $fields): array
    {
        return compact('key', 'title', 'description', 'fields');
    }

    /** One field. A "text" default that is long or has a line break is edited in a larger box. */
    private static function f(string $key, string $label, string $default, string $type = 'text', ?string $hint = null, ?string $group = null): array
    {
        if ($type === 'text' && (mb_strlen($default) > 140 || str_contains($default, "\n"))) {
            $type = 'textarea';
        }

        return compact('key', 'label', 'type', 'default', 'group', 'hint');
    }

    private static function seo(string $title, string $description): array
    {
        return self::section('seo', 'SEO & Meta', 'Browser tab title (" | Bahali Connect" is added) and search engine description.', [
            self::f('seo.title', 'Page Title', $title),
            self::f('seo.description', 'Meta Description', $description, 'textarea'),
        ]);
    }

    /* ------------------------------------------------------------------ */
    /*  Home                                                               */
    /* ------------------------------------------------------------------ */

    private static function home(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::seo('Find support. Feel understood.', 'Find mental health and emotional wellness providers serving Caribbean communities and the diaspora. Search is free.'),
            self::section('hero', 'Hero', 'Heading, intro and photograph at the top of the homepage.', [
                self::f('hero.eyebrow', 'Eyebrow', 'SUPPORT STARTS WITH CONNECTION'),
                self::f('hero.title', 'Heading', "Find support.\nFeel *understood.*", 'textarea', $h),
                self::f('hero.lead', 'Intro', 'Explore providers offering mental health care and community support for Caribbean communities and the diaspora.', 'textarea', $h),
                self::f('hero.note', 'Note', 'For you, your family or someone you care about. It is okay to ask for support, even if you are not sure where to start.', 'textarea', $h),
                self::f('hero.image', 'Photograph', '/images/connect/support-conversation.jpg', 'image', 'Landscape photo, about 1600×860.'),
                self::f('hero.image_alt', 'Photograph description (alt text)', 'Two women in conversation, with one listening attentively.'),
            ]),
            self::section('search', 'Search Box', 'The "Search for support" box under the hero.', [
                self::f('search.heading', 'Heading', 'Search for support'),
                self::f('search.intro', 'Intro', 'Explore the support available to you, at your own pace.'),
                self::f('search.country_label', 'Location Label', 'Where will you receive support?'),
                self::f('search.country_placeholder', 'Location Placeholder', 'Select country or territory'),
                self::f('search.country_search', 'Location Search Placeholder', 'Search countries and territories'),
                self::f('search.topic_label', 'Topic Label', 'What would you like help with?'),
                self::f('search.optional', '"Optional" Label', 'Optional'),
                self::f('search.topic_all', 'Topic "All" Option', 'Browse all support options'),
                self::f('search.topic_search', 'Topic Search Placeholder', 'Search areas of support'),
                self::f('search.button', 'Button', 'Find support'),
                self::f('search.busy', 'Button While Searching', 'Finding support…'),
                self::f('search.help', 'Help Text', 'You do not need to know which type of provider to look for.'),
                self::f('search.error', 'Missing Location Message', 'Choose where you will receive support to see relevant options.'),
            ]),
            self::section('strip', 'Intro Strip', 'Three short points under the search box.', [
                self::f('strip.item1', 'Point 1', 'Free to browse'),
                self::f('strip.item2', 'Point 2', 'Search without sharing your name.'),
                self::f('strip.item3', 'Point 3', 'Contact providers directly'),
            ]),
            self::section('how', 'How It Works', 'Three steps and the bench photograph.', [
                self::f('how.eyebrow', 'Eyebrow', 'HOW BAHALI CONNECT WORKS'),
                self::f('how.title', 'Heading', 'A clearer path to support.', 'text', $h),
                self::f('how.step1.title', 'Title', 'Find options', 'text', null, 'Step 01'),
                self::f('how.step1.body', 'Text', 'Choose your location and what you would like help with.', 'textarea', $h, 'Step 01'),
                self::f('how.step2.title', 'Title', 'Explore profiles', 'text', null, 'Step 02'),
                self::f('how.step2.body', 'Text', 'Compare services, languages, fees and meeting options at your own pace.', 'textarea', $h, 'Step 02'),
                self::f('how.step3.title', 'Title', 'Make a connection', 'text', null, 'Step 03'),
                self::f('how.step3.body', 'Text', 'Reach out to ask about availability and next steps.', 'textarea', $h, 'Step 03'),
                self::f('how.caption', 'Photograph Caption', 'Support can begin with a conversation.', 'text', null, 'Photograph'),
                self::f('how.image', 'Photograph', '/images/connect/community-connection.jpg', 'image', 'Landscape photo, about 1400×930.', 'Photograph'),
                self::f('how.image_alt', 'Photograph description (alt text)', 'Two older women smiling together on a bench.', 'text', null, 'Photograph'),
            ]),
            self::section('options', 'Understanding Your Options', 'Support types and the profile badge explanation.', [
                self::f('options.eyebrow', 'Eyebrow', 'UNDERSTANDING YOUR OPTIONS'),
                self::f('options.title', 'Heading', "Different needs.\nDifferent ways to find support.", 'textarea', $h),
                self::f('options.body', 'Text', 'Support can take different forms. Explore what each provider offers and choose whom you would like to learn more about.', 'textarea', $h),
                self::f('options.card1.title', 'Title', 'Clinical & counseling support', 'text', null, 'Card 1'),
                self::f('options.card1.body', 'Text', 'Explore therapy, counseling and assessment services.', 'textarea', $h, 'Card 1'),
                self::f('options.card2.title', 'Title', 'Community-based support', 'text', null, 'Card 2'),
                self::f('options.card2.body', 'Text', 'Explore peer, pastoral and other community-based emotional wellness support.', 'textarea', $h, 'Card 2'),
                self::f('badges.summary', 'Question', 'What do the profile badges mean?', 'text', null, 'Profile badges'),
                self::f('badges.body', 'Answer', 'Profile review means Bahali Connect has reviewed a listing. Optional credential verification is in development. Only profiles with a credential independently confirmed by Bahali Connect will receive the “Credentials verified” badge. Caribbean experience is provider-reported. A badge does not guarantee that a provider is the right fit for you.', 'textarea', $h, 'Profile badges'),
                self::f('badges.link', 'Link Text', 'Understand the profile badges', 'text', null, 'Profile badges'),
            ]),
            self::section('reading', 'Reading', 'Blog articles marked "Show on homepage" (the section hides when there are none).', [
                self::f('reading.eyebrow', 'Eyebrow', 'A LITTLE READING. A LITTLE REASSURANCE.'),
                self::f('reading.title', 'Heading', 'Start with understanding.', 'text', $h),
                self::f('reading.link', 'Blog Link Text', 'Explore the blog'),
                self::f('reading.minutes', 'Reading Time Label', 'min read'),
                self::f('reading.more', 'Card Link Text', 'Read article'),
            ]),
            self::section('providers', 'For Providers', 'Provider invitation band.', [
                self::f('providers.eyebrow', 'Eyebrow', 'FOR PROVIDERS'),
                self::f('providers.title', 'Heading', 'Help your community find support.', 'text', $h),
                self::f('providers.body', 'Text', 'Join a directory that welcomes eligible clinical and community-based providers from all backgrounds.', 'textarea', $h),
                self::f('providers.note', 'Bold Note', 'No directory listing fee.'),
                self::f('providers.button', 'Button', 'Join Bahali Connect'),
                self::f('providers.login', 'Login Link', 'Provider login'),
                self::f('providers.image', 'Photograph', '/images/connect/providers-in-community.jpg', 'image', 'Landscape photo, 4:3 (about 1400×1050).'),
                self::f('providers.image_alt', 'Photograph description (alt text)', 'Two women talking over coffee in a relaxed seating area.'),
            ]),
            self::section('faq', 'Questions', 'Frequently asked questions.', [
                self::f('faq.eyebrow', 'Eyebrow', 'A LITTLE MORE CLARITY'),
                self::f('faq.title', 'Heading', "Questions?\n Start here.", 'textarea', $h),
                self::f('faq.body', 'Text', 'Finding support should feel easier.', 'text', $h),
                self::f('faq1.q', 'Question', 'Is Bahali Connect free to use?', 'text', null, 'Question 1'),
                self::f('faq1.a', 'Answer', 'Yes. It is always free to search the directory, read profiles and contact providers directly. Only providers can create an account. Providers may charge for their own services.', 'textarea', $h, 'Question 1'),
                self::f('faq2.q', 'Question', 'How do I choose a provider?', 'text', null, 'Question 2'),
                self::f('faq2.a', 'Answer', 'Start with what matters most to you. You might want someone who understands your background, speaks your preferred language or offers sessions you can afford. If a profile feels like a good fit, you can reach out and ask, “What would it be like to work with you?”', 'textarea', $h, 'Question 2'),
                self::f('faq3.q', 'Question', 'Can I find virtual support?', 'text', null, 'Question 3'),
                self::f('faq3.a', 'Answer', 'Yes. Choose the country or territory where you will be during your sessions, then select virtual support. Before booking, check with the provider that they offer virtual sessions in that location.', 'textarea', $h, 'Question 3'),
                self::f('faq4.q', 'Question', 'How do I contact a provider?', 'text', null, 'Question 4'),
                self::f('faq4.a', 'Answer', 'You will find contact details on each profile. You can reach out to ask questions before deciding whether to arrange a meeting. You and the provider agree on any appointment directly.', 'textarea', $h, 'Question 4'),
                self::f('faq5.q', 'Question', 'What if I cannot find a match?', 'text', null, 'Question 5'),
                self::f('faq5.a', 'Answer', 'Try fewer filters or a related area of support. Your selected location stays the same until you change it.', 'textarea', $h, 'Question 5'),
            ]),
            self::section('closing', 'Closing', 'Last section of the homepage.', [
                self::f('closing.eyebrow', 'Eyebrow', 'BAHALI CONNECT'),
                self::f('closing.title', 'Heading', 'You do not need all the answers to begin.', 'text', $h),
                self::f('closing.button', 'Button', 'Find support'),
            ]),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  About Connect                                                      */
    /* ------------------------------------------------------------------ */

    private static function about(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::seo('About Connect', 'Bahali Connect makes mental health care and community support easier to find for Caribbean communities and the diaspora.'),
            self::section('intro', 'Introduction', 'Heading, intro and photograph (16:10).', [
                self::f('intro.eyebrow', 'Eyebrow', 'ABOUT BAHALI CONNECT'),
                self::f('intro.title', 'Heading', "Connection rooted\nin *understanding.*", 'textarea', $h),
                self::f('intro.lead', 'Intro', 'Bahali Connect makes mental health care and community support easier to find for Caribbean communities and the diaspora.', 'textarea', $h),
                self::f('intro.image', 'Photograph', '/images/connect/everyday-connection.jpg', 'image', 'Landscape photo, 16:10 (about 1600×1000).'),
                self::f('intro.image_alt', 'Photograph description (alt text)', 'Two women sitting on the grass, talking and smiling at each other.'),
            ]),
            self::section('why', 'Why We Created Bahali Connect', null, [
                self::f('why.title', 'Heading', 'Why we created Bahali Connect', 'text', $h),
                self::f('why.p1', 'Paragraph 1', 'If you have been taught to keep personal struggles to yourself or feel you should manage on your own, asking for support can feel unfamiliar. You deserve care, and seeking it is a sign of strength.', 'textarea', $h),
                self::f('why.p2', 'Paragraph 2', 'We created Bahali Connect as part of Bahali’s mission to reduce mental health stigma and improve access to care and support. Bringing provider information into one place makes it easier to explore your options and reach out when you are ready.', 'textarea', $h),
                self::f('why.p3', 'Paragraph 3', 'We welcome providers from all backgrounds. If you would like to find someone with experience supporting Caribbean individuals or families, you can read how providers describe that work in their own words.', 'textarea', $h),
            ]),
            self::section('profile', 'What a Profile Can Tell You', null, [
                self::f('profile.title', 'Heading', 'What a profile can tell you', 'text', $h),
                self::f('profile.p1', 'Paragraph 1', 'Each profile tells you who the provider supports, what they offer and how to reach them. Details such as languages spoken, fees and options for meeting in person or virtually can help you decide whom you would like to contact.', 'textarea', $h),
                self::f('profile.p2', 'Paragraph 2', '**Profile Reviewed** means Bahali Connect reviewed the profile for inclusion in the directory. It does not mean Bahali Connect independently verified the provider’s credentials.', 'textarea', $h),
                self::f('profile.link', 'Link Text (to Directory & Verification)', 'What the profile badges mean'),
            ]),
            self::section('bahali', 'A Service of Bahali', 'Mission, vision and the link to Bahali.org.', [
                self::f('bahali.title', 'Heading', 'A service of Bahali', 'text', $h),
                self::f('bahali.body', 'Text', 'Bahali Connect is a service of Bahali, a nonprofit working to make conversations about mental health more open and support more accessible.', 'textarea', $h),
                self::f('bahali.mission_title', 'Mission Heading', 'Our mission'),
                self::f('bahali.mission', 'Mission', 'To promote emotional well-being, reduce mental health stigma and improve access to culturally grounded resources, care and support across Caribbean communities and the diaspora.', 'textarea', $h),
                self::f('bahali.vision_title', 'Vision Heading', 'Our vision'),
                self::f('bahali.vision', 'Vision', 'A future where Caribbean communities and the global diaspora can speak openly about mental health and access the care and support they need.', 'textarea', $h),
                self::f('bahali.link', 'Link Text (to Bahali.org)', 'Visit Bahali.org'),
            ]),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  How it works                                                       */
    /* ------------------------------------------------------------------ */

    private static function how(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::seo('How it works', 'Take time to explore, ask questions and decide what feels right for you.'),
            self::section('intro', 'Introduction', null, [
                self::f('intro.eyebrow', 'Eyebrow', 'HOW IT WORKS'),
                self::f('intro.title', 'Heading', "One step at a time.\n*Your choice, your pace.*", 'textarea', $h),
                self::f('intro.lead', 'Intro', 'Take time to explore, ask questions and decide what feels right for you.', 'textarea', $h),
                self::f('intro.button', 'Button', 'Find support'),
            ]),
            self::section('steps', 'Steps', 'Search, compare and reach out.', [
                self::f('steps.title', 'Heading', 'Search, compare and reach out.', 'text', $h),
                self::f('step1.title', 'Title', 'Start where you are', 'text', null, 'Step 01'),
                self::f('step1.body', 'Text', 'Choose the country or territory where you would like support. If you are unsure what to select next, you can browse all support options.', 'textarea', $h, 'Step 01'),
                self::f('step2.title', 'Title', 'Compare what matters to you', 'text', null, 'Step 02'),
                self::f('step2.body', 'Text', 'Read about who each provider supports, how they work and what they charge. Look for the details that matter to you, such as language or meeting options.', 'textarea', $h, 'Step 02'),
                self::f('step3.title', 'Title', 'Ask about the next step', 'text', null, 'Step 03'),
                self::f('step3.body', 'Text', 'You can ask what a first meeting would be like and whether the provider has experience with your concerns. You and the provider arrange any appointment directly.', 'textarea', $h, 'Step 03'),
            ]),
            self::section('example', 'Illustrative Profile', 'The clearly labelled fictional example profile.', [
                self::f('example.label', 'Label', 'Illustrative profile · Fictional provider'),
                self::f('example.initials', 'Initials', 'NB'),
                self::f('example.name', 'Name', 'Naomi Bennett'),
                self::f('example.role', 'Role', 'Community support facilitator'),
                self::f('example.location', 'Location Line', 'St. Elizabeth, Jamaica · In person'),
                self::f('example.detail1.label', 'Label', 'Who I support', 'text', null, 'Detail 1'),
                self::f('example.detail1.text', 'Text', 'Adults caring for an aging parent or another older family member.', 'textarea', $h, 'Detail 1'),
                self::f('example.detail2.label', 'Label', 'What I offer', 'text', null, 'Detail 2'),
                self::f('example.detail2.text', 'Text', 'I lead a peer support group where caregivers can talk about what is on their minds and share what has helped them day to day.', 'textarea', $h, 'Detail 2'),
                self::f('example.detail3.label', 'Label', 'Group details', 'text', null, 'Detail 3'),
                self::f('example.detail3.text', 'Text', 'Twice a month · In English · Free to attend', 'textarea', $h, 'Detail 3'),
                self::f('example.link', 'Link Text', 'Explore the directory'),
            ]),
            self::section('info', 'Helpful Notes', 'Three short notes at the end of the page.', [
                self::f('info1.title', 'Heading', 'Not sure where to start?', 'text', null, 'Note 1'),
                self::f('info1.body', 'Text', 'Start with what you would like help with. You do not need to know a provider’s professional title to explore the support they offer.', 'textarea', $h, 'Note 1'),
                self::f('info2.title', 'Heading', 'Still looking for a good fit?', 'text', null, 'Note 2'),
                self::f('info2.body', 'Text', 'Try adjusting the type of support, language or meeting format in your search. Your chosen location stays the same unless you change it.', 'textarea', $h, 'Note 2'),
                self::f('info3.title', 'Heading', 'Wondering what to ask?', 'text', null, 'Note 3'),
                self::f('info3.body', 'Text', 'You can ask about fees, availability and what a first meeting is like. You might also ask about their experience with concerns like yours.', 'textarea', $h, 'Note 3'),
            ]),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  For Providers                                                      */
    /* ------------------------------------------------------------------ */

    private static function providers(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::seo('For providers', 'Share your services with Caribbean communities and the diaspora. Free to apply. Free to list an approved profile.'),
            self::section('hero', 'Hero', 'Heading, intro, buttons and photograph (4:3).', [
                self::f('hero.eyebrow', 'Eyebrow', 'FOR CLINICAL AND COMMUNITY PROVIDERS'),
                self::f('hero.title', 'Heading', "Make your support\n*easier to find.*", 'textarea', $h),
                self::f('hero.lead', 'Intro', 'Share your services with Caribbean communities and the diaspora. Give someone looking for support a clear way to learn about your work and reach you directly.', 'textarea', $h),
                self::f('hero.note', 'Bold Line', '**Free to apply. Free to list an approved profile.**', 'text', $h),
                self::f('hero.button', 'Button', 'Start your application'),
                self::f('hero.login', 'Login Link', 'Provider login'),
                self::f('hero.image', 'Photograph', '/images/connect/providers-in-community.jpg', 'image', 'Landscape photo, 4:3 (about 1400×1050).'),
                self::f('hero.image_alt', 'Photograph description (alt text)', 'Two women talking over coffee in a relaxed seating area.'),
            ]),
            self::section('benefits', 'Benefits', 'Three short benefits under the hero.', [
                self::f('benefit1.title', 'Heading', 'Describe your work', 'text', null, 'Benefit 1'),
                self::f('benefit1.body', 'Text', 'Describe who you support, what you offer and what a first meeting with you might be like.', 'textarea', $h, 'Benefit 1'),
                self::f('benefit2.title', 'Heading', 'Show where you are available', 'text', null, 'Benefit 2'),
                self::f('benefit2.body', 'Text', 'List the communities you serve and explain whether you meet in person, virtually or both.', 'textarea', $h, 'Benefit 2'),
                self::f('benefit3.title', 'Heading', 'Connect directly', 'text', null, 'Benefit 3'),
                self::f('benefit3.body', 'Text', 'Share your contact details so those seeking support can reach you with questions.', 'textarea', $h, 'Benefit 3'),
            ]),
            self::section('eligibility', 'Provider Eligibility', null, [
                self::f('eligibility.eyebrow', 'Eyebrow', 'PROVIDER ELIGIBILITY'),
                self::f('eligibility.title', 'Heading', 'Who can apply?', 'text', $h),
                self::f('eligibility.p1', 'Paragraph 1', 'We welcome applications from providers offering clinical care, counseling, pastoral care, peer support, allied health services or community-based emotional support. Eligibility depends on your role and the services you offer.', 'textarea', $h),
                self::f('eligibility.p2', 'Paragraph 2', 'Providers from all backgrounds are welcome to apply. If you have experience supporting Caribbean individuals, families or communities, you can describe that work in your own words.', 'textarea', $h),
                self::f('eligibility.question', 'Question', 'Do I need credential verification?'),
                self::f('eligibility.answer', 'Answer', 'No. We are developing an optional credential verification service. Only that service will carry a fee, and you will see the amount before you decide.', 'textarea', $h),
            ]),
            self::section('join', 'How to Join', 'Three application steps.', [
                self::f('join.title', 'Heading', 'How to join'),
                self::f('join.step1.title', 'Title', 'Create your provider account', 'text', null, 'Step 1'),
                self::f('join.step1.body', 'Text', 'Save your progress and come back when you are ready.', 'textarea', $h, 'Step 1'),
                self::f('join.step2.title', 'Title', 'Tell us about your work', 'text', null, 'Step 2'),
                self::f('join.step2.body', 'Text', 'Describe your services, who you support and where you are available. Choose the contact details you would like to share on your profile.', 'textarea', $h, 'Step 2'),
                self::f('join.step3.title', 'Title', 'Submit your application for review', 'text', null, 'Step 3'),
                self::f('join.step3.body', 'Text', 'The Bahali Connect team reviews your application and may ask for more information. Once approved, your profile appears in the directory.', 'textarea', $h, 'Step 3'),
            ]),
            self::section('spotlight', 'Provider Spotlights', 'Summary with a link to the Spotlight Policy.', [
                self::f('spotlight.eyebrow', 'Eyebrow', 'SHARING YOUR WORK'),
                self::f('spotlight.title', 'Heading', 'Provider spotlights', 'text', $h),
                self::f('spotlight.body', 'Text', 'From time to time, we feature providers to help readers learn about different services and approaches. Selection considers relevance to readers, current profile information and a range of roles and locations. There is no charge or paid preference, and credential verification does not influence selection. Participation is optional and requires permission.', 'textarea', $h),
                self::f('spotlight.link', 'Link Text', 'Read the Provider Spotlight Policy'),
            ]),
            self::section('closing', 'Closing', null, [
                self::f('closing.title', 'Heading', 'Ready to join Bahali Connect?', 'text', $h),
                self::f('closing.body', 'Text', 'Be part of Bahali’s mission to reduce mental health stigma and improve access to care and support. Let your profile be a starting point for someone seeking support in the communities you serve.', 'textarea', $h),
                self::f('closing.button', 'Button', 'Start your application'),
                self::f('closing.email', 'Email Line', 'Questions before you apply? Email [directory@bahali.org](mailto:directory@bahali.org).', 'text', $h),
            ]),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Urgent Help                                                        */
    /* ------------------------------------------------------------------ */

    private static function urgent(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::seo('Urgent Help', 'If you or someone else is in immediate danger, contact local emergency services now or go to the nearest hospital emergency department.'),
            self::section('intro', 'Introduction', null, [
                self::f('intro.eyebrow', 'Eyebrow', 'SUPPORT WHEN YOU NEED IT'),
                self::f('intro.title', 'Heading', 'Urgent Help', 'text', $h),
                self::f('intro.lead', 'Intro', '**If you or someone else is in immediate danger, contact local emergency services now or go to the nearest hospital emergency department.**', 'textarea', $h),
            ]),
            self::section('now', 'Find Support Now', 'The "Find a helpline" button opens Find A Helpline.', [
                self::f('now.title', 'Heading', 'Find support now', 'text', $h),
                self::f('now.p1', 'Paragraph 1', 'You deserve support during difficult moments. Helplines can offer a place to talk, receive emotional support and consider your next steps.', 'textarea', $h),
                self::f('now.button', 'Button', 'Find a helpline'),
                self::f('now.p2', 'Paragraph 2', 'Choose the country where the person needing help is **physically located right now**. This may be different from their home country or where you live.', 'textarea', $h),
                self::f('now.p3', 'Paragraph 3', 'Check each service’s listing for its hours, available languages and ways to get in touch.', 'textarea', $h),
                self::f('now.p4', 'Paragraph 4', 'If no suitable helpline is listed, contact a local health service for guidance. **If there is immediate danger, contact local emergency services or go to the nearest emergency department.**', 'textarea', $h),
            ]),
            self::section('about', 'About Bahali Connect', null, [
                self::f('about.title', 'Heading', 'About Bahali Connect', 'text', $h),
                self::f('about.body', 'Text', 'Bahali Connect helps you find providers for ongoing care and support. **We do not provide emergency care.** Our email and contact forms are not monitored for urgent assistance. Please use the options above if you need help now.', 'textarea', $h),
            ]),
            self::section('ongoing', 'Finding Ongoing Support', null, [
                self::f('ongoing.title', 'Heading', 'Finding ongoing support', 'text', $h),
                self::f('ongoing.body', 'Text', 'When you are ready to explore ongoing support, Bahali Connect can help you find providers offering services in your location and preferred language.', 'textarea', $h),
                self::f('ongoing.button', 'Button', 'Find ongoing support'),
            ]),
            self::section('footer', 'Page Footer', 'Small print and the "Page last checked" date. Update the date only after a real review.', [
                self::f('footer.note', 'Small Print', 'Bahali Connect is a service of Bahali Inc. Find A Helpline is an independent service that Bahali does not operate.', 'textarea', $h),
                self::f('footer.checked_label', 'Checked Label', 'Page last checked:'),
                self::f('footer.checked_date', 'Checked Date (shown)', 'November 18, 2026'),
                self::f('footer.checked_iso', 'Checked Date (YYYY-MM-DD)', '2026-11-18', 'text', 'Same date as above, written as YYYY-MM-DD (for screen readers and search engines).'),
            ]),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Get Help                                                           */
    /* ------------------------------------------------------------------ */

    private static function help(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::seo('Get Help', 'You do not need a diagnosis or the perfect words. Start with a concern, or explore all support options.'),
            self::section('intro', 'Introduction', null, [
                self::f('intro.eyebrow', 'Eyebrow', 'GET HELP'),
                self::f('intro.title', 'Heading', "What would you like\n*support with?*", 'textarea', $h),
                self::f('intro.lead', 'Intro', 'You do not need a diagnosis or the perfect words. Start with a concern, or explore all support options.', 'textarea', $h),
            ]),
            self::section('topics', 'Areas of Support', 'Topic search and the list of topics. Topic names and descriptions come from the directory taxonomy.', [
                self::f('topics.search_label', 'Search Label', 'Find an area of support'),
                self::f('topics.search_placeholder', 'Search Placeholder', 'Try depression, worry or caregiver stress'),
                self::f('topics.hint', 'Hint', 'Choose a topic, or continue without one.'),
                self::f('topics.none', 'No Match Message', 'No matching topic yet. Try a shorter phrase, or explore all support options.'),
                self::f('topics.all', '"Explore All" Button', 'Explore all support options'),
                self::f('topics.select', 'Topic Button', 'Select topic'),
                self::f('topics.selected', 'Topic Button (chosen)', 'Selected'),
                self::f('topics.more', '"See All" Button', 'See all areas of support', 'text', 'Keep this without a number so it stays correct as areas of support are added.'),
                self::f('topics.fewer', '"Show Fewer" Button', 'Show fewer areas of support'),
            ]),
            self::section('location', 'Your Next Step', 'Location panel on the right.', [
                self::f('location.change', '"Change Topic" Button', 'Change topic'),
                self::f('location.eyebrow', 'Eyebrow', 'YOUR NEXT STEP'),
                self::f('location.title', 'Heading (no topic)', 'Explore your options'),
                self::f('location.title_topic', 'Heading (topic chosen)', 'Support with {topic}', 'text', '{topic} is replaced with the chosen topic.'),
                self::f('location.body', 'Text', 'Select your location to find providers who serve your area. On the results page, narrow your search by language, type of service, or virtual support.', 'textarea', $h),
                self::f('location.country_label', 'Location Label', 'Country or territory'),
                self::f('location.country_placeholder', 'Location Placeholder', 'Select a location'),
                self::f('location.country_search', 'Location Search Placeholder', 'Search countries and territories'),
                self::f('location.optional', '"(optional)" Label', '(optional)'),
                self::f('location.region_all', 'Region "All" Option', 'All areas in {place}', 'text', '{place} is replaced with the chosen country.'),
                self::f('location.region_search', 'Region Search Placeholder', 'Search {area}', 'text', '{area} is replaced with "parishes", "regions" and so on.'),
                self::f('location.error', 'Missing Location Message', 'Choose where you would receive support, or explore across all locations.'),
            ]),
            self::section('all', 'All Locations', 'The "Explore across all locations" option.', [
                self::f('all.summary', 'Summary', 'Explore across all locations'),
                self::f('all.checkbox', 'Checkbox Label', 'Show profiles in all locations'),
                self::f('all.note', 'Note', 'This is a directory-wide view. A listing does not mean the provider can offer services where you are. Choose a location to narrow your options.', 'textarea', $h),
            ]),
            self::section('submit', 'Submit', 'Button and notes under it.', [
                self::f('submit.default', 'Button (no topic)', 'Find support'),
                self::f('submit.topic', 'Button (topic chosen)', 'Find support for this concern'),
                self::f('submit.busy', 'Button While Searching', 'Finding support…'),
                self::f('submit.note', 'Note', 'Free to search. Accounts are only for providers.', 'text', $h),
                self::f('submit.urgent', 'Urgent Help Line', 'Looking for crisis support? [Visit Urgent Help](/urgent-help).', 'text', $h),
            ]),
            self::section('reassurance', 'Reassurance', 'Section at the bottom of the page.', [
                self::f('reassurance.title', 'Heading', 'A first look is a step forward.', 'text', $h),
                self::f('reassurance.body', 'Text', 'You can read profiles, ask questions and take time to decide. You do not have to contact anyone before you feel ready.', 'textarea', $h),
            ]),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Contact / Report a concern (same page design, two sets of text)    */
    /* ------------------------------------------------------------------ */

    private static function contact(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::seo('Contact', 'Get in touch about the directory, your provider account, accessibility or privacy.'),
            self::section('intro', 'Introduction', null, [
                self::f('intro.eyebrow', 'Eyebrow', 'CONTACT CONNECT'),
                self::f('intro.title', 'Heading', 'How can we help?', 'text', $h),
                self::f('intro.lead', 'Intro', 'Have a question or need help finding your way around? Get in touch about the directory, your provider account, accessibility or privacy.', 'textarea', $h),
            ]),
            self::section('aside', 'Help Column', 'Text beside the form.', [
                self::f('aside.title', 'Heading', 'Find the help you need', 'text', $h),
                self::f('aside.provider_title', 'Heading', 'Provider inquiries', 'text', null, 'Provider inquiries'),
                self::f('aside.provider_body', 'Text', 'Have a question about joining Bahali Connect or managing your listing? Email [directory@bahali.org](mailto:directory@bahali.org) for help with your application, account, profile updates or questions about credential verification.', 'textarea', $h, 'Provider inquiries'),
                self::f('aside.privacy_title', 'Heading', 'Privacy and removal requests', 'text', null, 'Privacy and removal requests'),
                self::f('aside.privacy_body', 'Text', 'To ask about your personal information, withdraw your application or request removal of your profile, email [contact@bahali.org](mailto:contact@bahali.org).', 'textarea', $h, 'Privacy and removal requests'),
                self::f('aside.reach_title', 'Heading', 'Trying to reach a provider?', 'text', null, 'Trying to reach a provider?'),
                self::f('aside.reach_body', 'Text', 'Use the contact details on the provider’s profile to ask about services, fees or appointments. Your message goes directly to the provider.', 'textarea', $h, 'Trying to reach a provider?'),
                self::f('aside.note', 'Report Note', 'Use Report a concern for incorrect profile information, misleading credentials, inappropriate conduct or privacy concerns.', 'textarea', $h),
                self::f('aside.link', 'Link Text (to Report a concern)', 'Report a concern'),
            ]),
            ...self::supportNotes(),
            self::section('form', 'Form', 'Form labels, placeholders and buttons. Topic values stay fixed; only their labels change.', [
                self::f('form.title', 'Form Heading', 'Send an inquiry'),
                self::f('form.topic_label', 'Topic Label', 'What is your question about?'),
                self::f('form.topic_search', 'Topic Search Placeholder', 'Search topics'),
                self::f('topic.directory', 'Topic: directory', 'Using the directory', 'text', null, 'Topic options'),
                self::f('topic.account', 'Topic: account', 'Provider application or account', 'text', null, 'Topic options'),
                self::f('topic.privacy', 'Topic: privacy', 'Privacy or data request', 'text', null, 'Topic options'),
                self::f('topic.accessibility', 'Topic: accessibility', 'Accessibility or technical issue', 'text', null, 'Topic options'),
                self::f('topic.other', 'Topic: other', 'Other question', 'text', null, 'Topic options'),
                ...self::supportFormFields('Your message', 'The contact details you provide are used to respond to your inquiry.', 'Send inquiry'),
            ]),
            self::section('result', 'After Sending', 'Success and failure messages.', [
                self::f('success.title', 'Success Heading', 'Thank you. Your message has been received.'),
                self::f('success.body', 'Success Text', 'We will reply to the email address you gave.', 'textarea', $h),
                ...self::supportErrorFields(),
            ]),
        ];
    }

    private static function report(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::seo('Report a concern', 'Let the Bahali Connect team know if something on a profile seems inaccurate or an interaction has concerned you.'),
            self::section('intro', 'Introduction', null, [
                self::f('intro.eyebrow', 'Eyebrow', 'HELP KEEP CONNECT ACCURATE'),
                self::f('intro.title', 'Heading', 'Report a concern.', 'text', $h),
                self::f('intro.lead', 'Intro', 'If something on a profile seems inaccurate or an interaction has concerned you, you can let our team know here.', 'textarea', $h),
            ]),
            self::section('aside', 'Help Column', 'Text beside the form.', [
                self::f('aside.title', 'Heading', 'What to include', 'text', $h),
                self::f('aside.body', 'Text', 'Describe the issue and identify the relevant profile or page. Include only information needed to understand the concern.', 'textarea', $h),
                self::f('aside.note', 'Anonymous Note', 'You may leave your name and email blank. Without an email address, the team cannot ask follow-up questions or reply.', 'textarea', $h),
                self::f('aside.link', 'Link Text (to Contact)', 'General question? Contact Connect'),
                self::f('aside.small', 'Small Print', 'A directory report is separate from a complaint to a relevant licensing body or authority. A report does not guarantee a particular outcome.', 'textarea', $h),
            ]),
            ...self::supportNotes(),
            self::section('form', 'Form', 'Form labels, placeholders and buttons. The list of concern types stays fixed.', [
                self::f('form.title', 'Form Heading', 'Tell us about the concern'),
                self::f('form.category_label', 'Concern Label', 'Type of concern'),
                self::f('form.category_placeholder', 'Concern Placeholder', 'Select a concern'),
                self::f('form.category_search', 'Concern Search Placeholder', 'Search concerns'),
                self::f('form.profile_label', 'Provider Label', 'Provider name or page link'),
                self::f('form.profile_placeholder', 'Provider Placeholder', 'Provider name or directory page'),
                self::f('form.reply_label', 'Reply Checkbox', 'I would like a reply about this concern.'),
                ...self::supportFormFields('What happened?', 'Report details are used to assess and follow up on the concern, as explained in the Privacy Policy.', 'Submit concern'),
            ]),
            self::section('result', 'After Sending', 'Success and failure messages.', [
                self::f('success.title', 'Success Heading', 'Thank you. Your concern has been received.'),
                self::f('success.body', 'Success Text', 'The Bahali Connect team will review it. If you asked for a reply, we will use the email address you gave.', 'textarea', $h),
                ...self::supportErrorFields(),
            ]),
        ];
    }

    /** Privacy and urgent-help notes — the same wording on Contact and Report a concern. */
    private static function supportNotes(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::section('notes', 'Notes', 'Privacy and urgent-help notes in the help column.', [
                self::f('privacy.title', 'Heading', 'Your privacy matters', 'text', null, 'Privacy note'),
                self::f('privacy.body', 'Text', 'To protect your privacy, share only what we need to understand your question. Please leave out medical records, passwords, identity documents and private details about other people. Please do not send attachments.', 'textarea', $h, 'Privacy note'),
                self::f('privacy.link', 'Link Text', 'Read the Privacy Policy', 'text', null, 'Privacy note'),
                self::f('urgent.title', 'Heading', 'Not for urgent help', 'text', null, 'Urgent note'),
                self::f('urgent.body', 'Text', 'These forms are not monitored for emergencies. If there is immediate danger, contact emergency services where you are.', 'textarea', $h, 'Urgent note'),
            ]),
        ];
    }

    private static function supportFormFields(string $messageLabel, string $privacyNote, string $submit): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::f('form.message_label', 'Message Label', $messageLabel),
            self::f('form.message_placeholder', 'Message Placeholder', 'Please include only information needed to understand your message.'),
            self::f('form.optional', '"(optional)" Label', '(optional)'),
            self::f('form.name_label', 'Name Label', 'Your name'),
            self::f('form.name_placeholder', 'Name Placeholder', 'Your name'),
            self::f('form.email_label', 'Email Label', 'Email address'),
            self::f('form.email_placeholder', 'Email Placeholder', 'you@example.com'),
            self::f('form.privacy_note', 'Privacy Note', $privacyNote, 'textarea', $h),
            self::f('form.privacy_link', 'Privacy Link Text', 'Privacy Policy'),
            self::f('form.submit', 'Button', $submit),
            self::f('form.sending', 'Button While Sending', 'Sending…'),
        ];
    }

    private static function supportErrorFields(): array
    {
        return [
            self::f('error.title', 'Failure Heading', 'Your message could not be sent.'),
            self::f('error.body', 'Failure Text', 'Please try again later, or email [contact@bahali.org](mailto:contact@bahali.org). Email includes your email address; if you prefer to report anonymously, please try this form again later.', 'textarea', self::FORMAT_HINT),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Blog page + fixed text on every article                            */
    /* ------------------------------------------------------------------ */

    private static function blog(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::seo('Blog', 'Perspectives on support, culture and connection from Bahali Connect — for the questions you have and the next step that feels right for you.'),
            self::section('masthead', 'Masthead', 'Top of the blog page. The label is also shown on every article.', [
                self::f('masthead.label', 'Label', 'THE BAHALI CONNECT BLOG'),
                self::f('masthead.tagline', 'Tagline', 'Perspectives on support, culture & connection'),
                self::f('masthead.title', 'Heading', "A place for\n*understanding.*", 'textarea', $h),
                self::f('masthead.body', 'Text', 'For the questions you have, the words you are finding and the next step that feels right for you.', 'textarea', $h),
                self::f('masthead.link', 'Link Text', 'Find something for you'),
            ]),
            self::section('lead', 'Lead Story', 'The featured article (chosen in CMS → Blog), its photograph and quote.', [
                self::f('lead.kicker', 'Kicker', 'A WELCOME FROM OUR FOUNDER'),
                self::f('lead.link', 'Link Text', 'Read the welcome'),
                self::f('lead.image', 'Photograph', '/images/connect/moment-of-connection.jpg', 'image', 'Landscape photo, 3:2 (about 1500×1000).'),
                self::f('lead.image_alt', 'Photograph description (alt text)', 'Two adults sharing coffee and a relaxed conversation at home.'),
                self::f('quote.eyebrow', 'Eyebrow', 'A THOUGHT TO TAKE WITH YOU', 'text', null, 'Quote'),
                self::f('quote.text', 'Quote', 'Being strong does not mean you have to carry everything alone.', 'textarea', $h, 'Quote'),
                self::f('quote.credit', 'Credit', 'From our founder’s welcome', 'text', null, 'Quote'),
                self::f('quote.link', 'Link Text', 'A place to begin', 'text', null, 'Quote'),
            ]),
            self::section('paths', 'Reading Paths', '"What brings you here today?" buttons.', [
                self::f('paths.question', 'Question', 'What brings you here today?'),
                self::f('paths.first_step', 'Button: Taking the first step', 'I am considering support'),
                self::f('paths.fit', 'Button: Finding your fit', 'I want to understand my options'),
                self::f('paths.supporting', 'Button: Supporting someone', 'I am here for someone I care about'),
            ]),
            self::section('library', 'Library', 'Article list, search and category buttons. Category names on articles stay fixed; only the button labels change.', [
                self::f('library.eyebrow', 'Eyebrow', 'READ AT YOUR OWN PACE'),
                self::f('library.title', 'Heading', 'A little more clarity.'),
                self::f('library.title_providers', 'Heading (For Providers selected)', 'For the work you do.'),
                self::f('library.search_label', 'Search Label', 'Find a topic'),
                self::f('library.search_placeholder', 'Search Placeholder', 'Search the articles'),
                self::f('library.all', 'Button: All', 'All reading', 'text', null, 'Category buttons'),
                self::f('category.first_step', 'Button: Taking the first step', 'Considering support', 'text', null, 'Category buttons'),
                self::f('category.fit', 'Button: Finding your fit', 'Finding your way', 'text', null, 'Category buttons'),
                self::f('category.supporting', 'Button: Supporting someone', 'Supporting someone', 'text', null, 'Category buttons'),
                self::f('category.providers', 'Button: For Providers', 'For Providers', 'text', null, 'Category buttons'),
                self::f('library.article', 'Count Label (1)', 'article', 'text', null, 'Result count'),
                self::f('library.articles', 'Count Label (2+)', 'articles', 'text', null, 'Result count'),
                self::f('card.minutes', 'Reading Time Label', 'min read', 'text', null, 'Article cards'),
                self::f('card.more', 'Card Link Text', 'Read article', 'text', null, 'Article cards'),
            ]),
            self::section('empty', 'No Results', 'Shown when no article matches.', [
                self::f('empty.title', 'Heading', 'Let us try another way.'),
                self::f('empty.body', 'Text', 'Try a different phrase, or explore the full reading collection.', 'textarea', $h),
                self::f('empty.supporting_title', 'Heading (Supporting someone)', 'Sometimes the first step is looking together.'),
                self::f('empty.supporting_body', 'Text (Supporting someone)', 'Our current guides can help you explore options alongside someone you care about. Their preferences can guide the conversation.', 'textarea', $h),
                self::f('empty.button', 'Button', 'Explore the reading collection'),
            ]),
            self::section('resources', 'Resources Note', 'Link to Bahali’s resource hub.', [
                self::f('resources.eyebrow', 'Eyebrow', 'SOMETHING PRACTICAL TO KEEP CLOSE'),
                self::f('resources.title', 'Heading', 'Tools for everyday well-being.', 'text', $h),
                self::f('resources.body', 'Text', 'Explore Bahali’s emotional wellness guides and resources for yourself or someone you care about.', 'textarea', $h),
                self::f('resources.link', 'Link Text', 'Explore Bahali’s resources'),
            ]),
            self::section('providers', 'For Providers Note', 'Link to the provider invitation article.', [
                self::f('providers.eyebrow', 'Eyebrow', 'FOR PROVIDERS'),
                self::f('providers.title', 'Heading', "Your work matters.\nHelp it reach your community.", 'textarea', $h),
                self::f('providers.body', 'Text', 'A note from our founder on joining Bahali Connect, sharing your services and making support easier to find.', 'textarea', $h),
                self::f('providers.link', 'Link Text', 'Read the invitation'),
            ]),
            self::section('closing', 'Closing', 'Last section of the blog page.', [
                self::f('closing.eyebrow', 'Eyebrow', 'WHEN YOU ARE READY'),
                self::f('closing.title', 'Heading', 'You can begin with a question.', 'text', $h),
                self::f('closing.body', 'Text', 'Explore providers, learn about their work and take time to decide.', 'textarea', $h),
                self::f('closing.button', 'Button', 'Find support'),
            ]),
            self::section('article', 'Article Page', 'Fixed text shown on every article.', [
                self::f('article.back', 'Back Link', 'Back to the collection'),
                self::f('article.written_by', '"Written By" Label', 'WRITTEN BY'),
                self::f('article.default_author', 'Author When Not Set', 'Bahali Connect'),
                self::f('article.reviewed_by', 'Reviewer Line', 'Reviewed by {name}', 'text', '{name} is replaced with the reviewer’s name.'),
                self::f('article.pace', 'Pace Note', 'Read at your own pace.'),
                self::f('article.toc', 'Contents Heading', 'In this article'),
                self::f('article.copy', 'Copy Link Button', 'Copy article link'),
                self::f('article.copied', 'Link Copied Message', 'Article link copied.'),
                self::f('article.copy_failed', 'Copy Failed Message', 'Copy the article address from your browser to share it.'),
                self::f('article.quote_label', 'Margin Quote Label', 'A thought to keep close'),
                self::f('article.footer', 'Closing Line', '*Bahali Connect is an initiative of Bahali Inc.*', 'text', $h),
                self::f('next.eyebrow', 'Eyebrow', 'WHEN YOU ARE READY', 'text', null, 'Next step box'),
                self::f('next.title', 'Heading', 'A next step, at your pace.', 'text', $h, 'Next step box'),
                self::f('next.provider_eyebrow', 'Eyebrow (provider articles)', 'JOIN THE COMMUNITY', 'text', null, 'Next step box'),
                self::f('next.provider_title', 'Heading (provider articles)', 'Help your community find your work.', 'text', $h, 'Next step box'),
                self::f('related.eyebrow', 'Eyebrow', 'KEEP EXPLORING', 'text', null, 'Related articles'),
                self::f('related.title', 'Heading', 'A little more understanding.', 'text', $h, 'Related articles'),
                self::f('related.link', 'Link Text', 'Explore the collection', 'text', null, 'Related articles'),
            ]),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Policy pages                                                       */
    /* ------------------------------------------------------------------ */

    private const BODY_HINT = 'Start each section with "## Section title" on its own line. Leave a blank line between paragraphs. Lines starting with "- " become a bullet list. **bold**, *italic* and [link text](mailto:name@bahali.org) also work.';

    /** Privacy Policy, Terms of Use, Directory & Verification and Accessibility Statement (same design). */
    private static function policy(string $kind): array
    {
        $h = self::FORMAT_HINT;
        [$title, $intro, $button, $body] = match ($kind) {
            'privacy' => ['Privacy Policy', 'Learn what happens to your information when you search for support, list your services or get in touch with Bahali.', 'Ask a privacy question', <<<'MD'
## Who this policy applies to

Bahali Inc. operates Bahali Connect, a directory of mental health and emotional wellness providers serving Caribbean communities and the diaspora. This policy explains how we handle information when you look for support, apply to join the directory, manage a profile or contact us.

## Looking for support

Accounts are only for providers. When you search or read profiles, we do not ask for your name, email address or phone number. Providers cannot see who viewed their profiles. Bahali does not use your searches to contact you or send you marketing messages.

## Contacting an independent provider

Call opens your phone app, Email opens your email app and Visit website takes you to the provider’s website. Bahali Connect does not handle messages or bookings between you and a provider, and Bahali does not receive a copy of your inquiry. The provider’s privacy practices apply to information you share with them directly.

## Search locations and analytics

Bahali uses aggregate counts to identify gaps in provider coverage and decide where to invite more providers to join. Of the information you enter in a directory search, only the location you select for support is sent to Google Analytics. We do not send your search terms to Google Analytics, including through page URLs or event labels.

## Where you search from

The place you want support may differ from the approximate area you are searching from. For example, if you search from New York for a provider in Jamaica, Jamaica is your selected search location. Analytics reports can also show the approximate area a visit came from. Depending on browser and consent settings, Google Analytics can process technical information such as browser or device details and cookie identifiers to measure visits.

## Provider accounts and public profiles

We use your application information to administer your account, review your application and publish the details you select for your profile. You must give Bahali contact information, including a phone number, and choose how visitors can reach you. Providing a phone number to Bahali does not automatically publish it. Your login email stays separate unless you choose to make it public. If you offer in-person services, your service location is shown. If you offer only virtual services, you can hide your street address.

## Credentials and optional verification

Bahali’s administrative team can review license numbers, copies of licenses, identification and other supporting documents submitted with an application. Identification and supporting documents are not published on your profile. Applying and maintaining an approved profile are free. Bahali is developing an optional credential verification service. If you choose it once available, an administrator will check the relevant public licensing register and may contact the board directly. This will be the only directory fee Bahali charges providers. It covers the administrative cost of the review, and you will see the amount before you decide. Your profile will receive the “Credentials verified” badge only if Bahali independently confirms the credential. Verification is not required to keep an approved listing.

## Questions and concern reports

When you email us, we receive your email address and what you choose to share. You can report a directory concern without giving your name or email. Bahali’s administrative team reviews reports. If we contact the provider, we share the substance of the concern and do not disclose your identity. Someone familiar with the circumstances may still recognize the incident. Include a contact address if you would like a reply. Please leave medical records, passwords and identity documents out of general inquiries and reports.

## Services that support the directory

Hostinger hosts the directory. Google Analytics helps us understand directory use as described above. If you follow a link to an independent provider’s website, that website’s privacy practices apply.

## Removing a listing and deleting provider records

To withdraw your application or remove your profile, email [contact@bahali.org](mailto:contact@bahali.org). When we process your removal request, we take down any public listing and delete your account, application and credential documents from the active directory system. Privacy correspondence and concern reports are separate records: we keep those for four years. This four-year period does not apply to your provider account, application or credential documents.

## Your privacy questions and requests

To ask about your information, request a correction or deletion, or raise a privacy concern, email [contact@bahali.org](mailto:contact@bahali.org). Bahali’s administrator monitors this inbox. Tell us which profile or request you are writing about. For information you shared directly with a provider, contact that provider.

## Changes to this policy

We will post revisions on this page so you can review how Bahali handles directory information.
MD],
            'terms' => ['Terms of Use', 'Responsibilities when using Bahali Connect as a visitor or provider.', 'Contact Connect', <<<'MD'
## About the directory

Bahali Connect helps people discover independent mental health and emotional wellness providers. Browsing a profile or contacting a provider does not book an appointment or establish a clinical relationship with Bahali.

## Independent providers and your choices

Providers describe their own services, fees and availability. Confirm current qualifications, location eligibility, service suitability, costs and any insurance arrangements directly. Clinical services and community-based support serve different purposes; their roles should be clearly distinguished.

## Provider accounts and truthful information

Providers must submit accurate information, have authority to offer their listed services in each location and have permission to publish submitted materials. Providers are responsible for protecting their account and keeping public details current. Account creation does not guarantee acceptance or publication.

## Review, changes and removal

Bahali may request clarification, correct information, pause a listing or remove a profile that does not meet directory eligibility or conduct requirements. For questions about an application or listing decision, contact directory@bahali.org.

## Acceptable use

Do not impersonate others, submit misleading credentials, harass people, post unlawful material or attempt unauthorized access. Use reporting tools in good faith and avoid sending unnecessary sensitive information about yourself or others.

## Content and permissions

Submit only content you have the right to use and publish. By submitting information or photographs for a public profile, you permit Bahali to display the materials you select for publication as part of the directory. Do not reuse another provider’s materials without permission.

## Fees and external services

Searching the directory is always free. Applying for and maintaining an approved provider listing are free. Optional credential verification is in development; providers who choose it will see the administrative fee before deciding. Independent providers may charge for their services. External websites, payment arrangements and provider-client agreements are separate from Bahali Connect.

## Service limits and disagreements

Availability and profile information can change. A listing or review label does not guarantee quality, suitability, availability or results. Confirm arrangements directly with the provider. Contact Bahali about directory concerns; concerns about professional practice may also be raised with the relevant licensing body or authority.

## Acceptance and updates

Providers must agree to the Terms of Use when creating an account. Bahali may update these terms and will publish the current version on this page with its effective date.

## Questions

Use Contact for questions about directory use or provider accounts. Use Report a concern for inaccurate profiles, concerns about credentials or inappropriate conduct.
MD],
            'directory' => ['Directory & Verification', 'What profile information and review labels can—and cannot—tell you.', 'Contact Connect', <<<'MD'
## A starting point for finding support

The directory presents information about independent providers. A listing is not a recommendation of one provider over another, a guarantee of quality or a promise of availability or results. Confirm services and suitability directly before making arrangements.

## Profile reviewed

Bahali has reviewed the profile for directory eligibility and completeness. Profile review does not mean that a professional license or credential has been independently verified. Only a separate “Credentials verified” badge indicates that Bahali has independently confirmed the specified credential.

## Credentials verified

Optional credential verification is in development. Applying and maintaining an approved profile are free. Once verification is available, providers who choose it will see the administrative review fee before deciding. The “Credentials verified” badge will appear only after Bahali independently confirms the specified credential. Paying for a review does not guarantee a badge. The badge applies only to the credential checked.

## Caribbean support experience

This label reflects the provider’s own report of experience supporting Caribbean individuals, families or communities, including the diaspora. It is not a certification or an inference about ethnicity. Providers from all backgrounds are welcome.

## Different forms of support

Clinical, counseling, peer, pastoral, allied and other community support roles are not interchangeable. Review each provider’s role, qualifications and actual services. A professional title or badge should not imply a scope of practice the provider does not hold.

## Information that may change

Fees, insurance, locations, accessibility and availability are supplied by providers and may change. Check current arrangements directly. Virtual support must be available for your location, rather than simply offered somewhere.

## Reporting concerns

Use Report a concern to flag an inaccurate profile, misleading credentials, inappropriate conduct or a privacy issue. Directory reporting is separate from a complaint to a relevant licensing body or other authority. Bahali’s administrative team reviews reports and may contact the provider about the substance of a concern. You can report without giving your name or email. If you provide your identity, Bahali does not disclose it to the provider.

## Urgent help

Bahali Connect’s directory and support forms are not emergency services and are not monitored for urgent help. If there is immediate danger, contact emergency services where you are.
MD],
            'accessibility' => ['Accessibility Statement', 'Finding support should be accessible. Tell us if something makes the directory difficult to use.', 'Report an accessibility barrier', <<<'MD'
## Our commitment

Bahali Connect aims to make its search, profiles and provider tools usable by people with disabilities. We aim to align with WCAG 2.2 Level AA. This is an accessibility goal, not a claim of independently tested conformance.

## Accessibility features

The website includes labeled fields, keyboard-operable controls, visible focus indicators, a skip-to-content link, responsive layouts and reduced-motion support.

## Current limitations

A formal independent accessibility audit has not been completed. Third-party websites may have different accessibility features. If any part of Bahali Connect is difficult to use, please tell us so we can investigate and help you find another way to access the information.

## Ask for help or report a barrier

Use Contact → Accessibility or technical issue. Tell us the page address, what you were trying to do, what happened and your preferred way to receive a reply. Device and assistive-technology details are optional. Do not include medical records or passwords.

## Alternative contact and response process

If you cannot use a website feature or form, email [contact@bahali.org](mailto:contact@bahali.org). Describe the information or assistance you need and your preferred way to receive a reply. Bahali’s administrator monitors this inbox.

## Keeping this statement current

We will review this statement as the website changes and publish updates on this page.
MD],
        };

        return [
            self::seo($title, $intro),
            self::section('intro', 'Introduction', null, [
                self::f('intro.eyebrow', 'Eyebrow', 'INFORMATION & YOUR CHOICES'),
                self::f('intro.title', 'Heading', $title, 'text', $h),
                self::f('intro.lead', 'Intro', $intro, 'textarea', $h),
                self::f('intro.effective', 'Effective Date Line', 'Effective November 18, 2026'),
            ]),
            self::section('body', 'Policy Text', 'Every section of the page. The "On this page" list is built from the section titles.', [
                self::f('body', 'Policy Text', $body, 'markdown', self::BODY_HINT),
            ]),
            self::section('side', 'Contents & Help', '"On this page" list and the help box at the end.', [
                self::f('toc.title', 'Contents Heading', 'On this page'),
                self::f('toc.link', 'Contents Link (to Contact)', 'Contact Connect'),
                self::f('help.title', 'Help Box Heading', 'Need help with the directory?', 'text', $h),
                self::f('help.button', 'Help Box Button', $button),
                self::f('help.report', 'Help Box Link (to Report a concern)', 'Report a concern'),
            ]),
        ];
    }

    private static function spotlight(): array
    {
        $h = self::FORMAT_HINT;
        $body = <<<'MD'
## How providers are selected

Bahali’s administrative team considers:

- **Usefulness to readers:** The feature explains a service, approach or support need relevant to Bahali Connect’s audience.
- **Clear, current information:** The provider has an approved, published directory profile and can accurately describe their qualifications, experience and services.
- **Variety over time:** Features represent different provider roles, locations, services and communities served.

Providers from all backgrounds may be considered. Experience supporting Caribbean communities is understood through the provider’s description of their work, rather than assumptions about their identity.

Providers may express interest by emailing [directory@bahali.org](mailto:directory@bahali.org). Expressing interest does not guarantee selection. Publication depends on editorial priorities and team capacity; there is no guaranteed schedule or entitlement to a feature.

## No paid preference

There is no charge to participate. Providers cannot purchase a spotlight, priority placement or favorable coverage.

Credential verification, verification badges, donations, sponsorships and other financial contributions do not influence selection. Providers with and without a verification badge may be considered.

Participation is optional. Accepting or declining a spotlight does not affect a provider’s application review, directory listing or eligibility for credential verification.

## Permission and use of materials

Before publication, Bahali obtains written permission covering participation, the materials used and the channels where the feature may appear. Use beyond that permission requires additional agreement.

Providers must have the right to share photographs and other materials they submit. Spotlights do not include identifiable client information, client stories or client testimonials.

The provider reviews the proposed feature for factual accuracy and confirms permission to publish. Bahali retains editorial responsibility for the final wording, presentation and publication decision. Material changes made after confirmation are shared with the provider for renewed approval before publication.

## Accuracy and transparency

Features must describe qualifications, experience and services accurately. They must not contain unsupported clinical claims, guarantees of results or misleading statements about credentials.

Bahali checks the proposed feature against the directory profile and seeks clarification where needed. This editorial review does not constitute independent credential verification.

A relevant personal, professional or financial relationship between a featured provider and Bahali is disclosed in the feature. A team member with a conflict of interest does not make the selection decision alone. If an impartial review cannot be arranged, the feature is deferred.

## What a spotlight means

A spotlight is an introduction to a provider’s work. It is not an endorsement, ranking, clinical recommendation or guarantee of quality, availability or results. Selection does not imply that a featured provider is more qualified or suitable than another provider.

Being featured does not verify credentials or confer a verification badge. Readers should review the provider’s profile and confirm services, qualifications, fees and suitability directly.

## Corrections, updates and removal

Providers are expected to tell Bahali when a material detail in their feature changes. Providers and readers may report inaccuracies or concerns to [directory@bahali.org](mailto:directory@bahali.org).

Bahali may correct, update, pause or remove a feature when information changes, a directory profile is unpublished or a concern requires review. Pausing a feature during review does not imply that a concern has been substantiated.

Providers may withdraw permission for future promotion or request removal from channels Bahali controls. Bahali will stop new promotion and process the removal request as promptly as reasonably possible. Bahali cannot guarantee removal of material already distributed, cached or shared by others.

## Contact

For spotlight inquiries, permissions, corrections or removal requests, email [directory@bahali.org](mailto:directory@bahali.org).
MD;

        return [
            self::seo('Provider Spotlight Policy', 'How Bahali selects, prepares and publishes provider spotlights. There is no charge and no paid preference.'),
            self::section('intro', 'Introduction', null, [
                self::f('intro.eyebrow', 'Eyebrow', 'PROVIDER INFORMATION'),
                self::f('intro.title', 'Heading', 'Bahali Connect Provider Spotlight Policy', 'text', $h),
                self::f('intro.effective_label', 'Effective Label', 'Effective'),
                self::f('intro.effective_date', 'Effective Date (shown)', 'November 18, 2026'),
                self::f('intro.effective_iso', 'Effective Date (YYYY-MM-DD)', '2026-11-18', 'text', 'Same date as above, written as YYYY-MM-DD.'),
                self::f('intro.lead', 'Intro', 'Provider spotlights introduce readers to the work of providers listed on Bahali Connect. They help readers learn about different services, approaches and forms of support across Caribbean communities and the diaspora.', 'textarea', $h),
            ]),
            self::section('body', 'Policy Text', 'Every section of the page. The "On this page" list is built from the section titles.', [
                self::f('body', 'Policy Text', $body, 'markdown', self::BODY_HINT),
            ]),
            self::section('side', 'Contents & Update Note', null, [
                self::f('toc.title', 'Contents Heading', 'On this page'),
                self::f('toc.link', 'Contents Link (to For Providers)', 'For Providers'),
                self::f('update.note', 'Update Note', 'Bahali may update this policy as its spotlight program develops. The current version will be published on this page, with the date of the most recent revision.', 'textarea', $h),
            ]),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Header & footer (every public page)                                */
    /* ------------------------------------------------------------------ */

    private static function layout(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::section('header', 'Header', 'Bahali emblem, Bahali Connect wordmark, "A service of Bahali" link, Get Help button and accessibility labels.', [
                self::f('header.emblem', 'Bahali Emblem', '/images/bahali-icon.png', 'image', 'Small round emblem left of the wordmark. Square image, at least 120×120. Use the emblem only, not the full Bahali logo.'),
                self::f('header.wordmark', 'Wordmark (regular)', 'Bahali'),
                self::f('header.wordmark_bold', 'Wordmark (bold)', 'Connect'),
                self::f('header.endorsement', '"A service of Bahali" Link Text', 'A SERVICE OF BAHALI', 'text', 'Small link under the wordmark. It opens Bahali.org.'),
                self::f('header.endorsement_label', '"A service of Bahali" Link Label (screen readers)', 'A service of Bahali — visit Bahali.org in a new tab'),
                self::f('header.home_label', 'Wordmark Link Label (screen readers)', 'Bahali Connect home'),
                self::f('header.button', 'Get Help Button', 'Get Help'),
                self::f('header.skip', '"Skip to content" Link', 'Skip to content'),
                self::f('header.menu_open', 'Mobile Menu Label (open)', 'Open navigation'),
                self::f('header.menu_close', 'Mobile Menu Label (close)', 'Close navigation'),
            ]),
            self::section('nav', 'Main Navigation', 'Menu items. Addresses stay fixed.', [
                self::f('nav.browse', 'Browse providers', 'Browse providers'),
                self::f('nav.how', 'How it works', 'How it works'),
                self::f('nav.about', 'About Connect', 'About Connect'),
                self::f('nav.blog', 'Blog', 'Blog'),
                self::f('nav.contact', 'Contact', 'Contact'),
                self::f('nav.providers', 'Menu Button', 'For Providers', 'text', null, 'For Providers menu'),
                self::f('nav.join', 'Join Link', 'Join Bahali Connect', 'text', null, 'For Providers menu'),
                self::f('nav.login', 'Login Link', 'Provider login', 'text', null, 'For Providers menu'),
                self::f('nav.dashboard', 'Dashboard Link (signed in)', 'My dashboard', 'text', null, 'For Providers menu'),
                self::f('nav.edit', 'Edit Profile Link (signed in)', 'Edit profile', 'text', null, 'For Providers menu'),
                self::f('nav.logout', 'Log Out Button (signed in)', 'Log out', 'text', null, 'For Providers menu'),
            ]),
            self::section('footer', 'Footer', 'Footer text, columns and the Bahali logo.', [
                self::f('footer.logo', 'Bahali Logo (white)', '/images/connect/bahali-logo-white.png', 'image', 'White logo on a transparent background (about 600×213).', 'About Bahali'),
                self::f('footer.logo_alt', 'Logo description (alt text)', 'Bahali', 'text', null, 'About Bahali'),
                self::f('footer.logo_label', 'Logo Link Label (screen readers)', 'Bahali — visit Bahali.org', 'text', null, 'About Bahali'),
                self::f('footer.about', 'Text', 'Bahali Connect is a service of Bahali, a nonprofit supporting emotional wellness across Caribbean communities and the diaspora.', 'textarea', $h, 'About Bahali'),
                self::f('footer.bahali_link', 'Link Text', 'Visit Bahali.org', 'text', null, 'About Bahali'),
                self::f('footer.explore_title', 'Heading', 'Explore', 'text', null, 'Explore column'),
                self::f('footer.explore_help', 'Get Help Link', 'Get Help', 'text', null, 'Explore column'),
                self::f('footer.explore_browse', 'Browse Link', 'Browse providers', 'text', null, 'Explore column'),
                self::f('footer.explore_blog', 'Blog Link', 'Blog', 'text', null, 'Explore column'),
                self::f('footer.providers_title', 'Heading', 'For providers', 'text', null, 'For providers column'),
                self::f('footer.providers_join', 'Join Link', 'Join the directory', 'text', null, 'For providers column'),
                self::f('footer.providers_login', 'Login Link', 'Provider login', 'text', null, 'For providers column'),
                self::f('footer.providers_account', 'Account Link (signed in)', 'My provider account', 'text', null, 'For providers column'),
                self::f('footer.note_title', 'Heading', "Because every mind\ndeserves peace.", 'textarea', $h, 'Note column'),
                self::f('footer.resource', 'Resources Link', 'Explore emotional wellness resources', 'text', null, 'Note column'),
                self::f('footer.fees', 'Fees Note', 'Provider services and fees vary. Contact providers directly to discuss your needs.', 'textarea', $h, 'Note column'),
                self::f('footer.copyright', 'Copyright Line', '© {year} Bahali Inc. All rights reserved.', 'text', '{year} is replaced with the current year.', 'Bottom row'),
            ]),
            self::section('legal', 'Footer Links', 'Links in the bottom row. Addresses stay fixed.', [
                self::f('legal.urgent', 'Urgent Help', 'Urgent Help'),
                self::f('legal.privacy', 'Privacy Policy', 'Privacy Policy'),
                self::f('legal.terms', 'Terms of Use', 'Terms of Use'),
                self::f('legal.directory', 'Directory & Verification', 'Directory & Verification'),
                self::f('legal.spotlight', 'Spotlight Policy', 'Spotlight Policy'),
                self::f('legal.accessibility', 'Accessibility', 'Accessibility'),
                self::f('legal.contact', 'Contact', 'Contact'),
                self::f('legal.report', 'Report a concern', 'Report a concern'),
            ]),
        ];
    }

    /* ------------------------------------------------------------------ */
    /*  Provider login, forgot password, reset password                    */
    /* ------------------------------------------------------------------ */

    private static function auth(): array
    {
        $h = self::FORMAT_HINT;

        return [
            self::section('intro', 'Left Column', 'Shared by the login, forgot password and reset password pages.', [
                self::f('intro.eyebrow', 'Eyebrow', 'BAHALI CONNECT FOR PROVIDERS'),
                self::f('intro.title', 'Heading', 'Welcome back.', 'text', $h),
                self::f('intro.lead', 'Intro', 'Return to your application or manage your published profile.', 'textarea', $h),
                self::f('thanks.title', 'Heading', 'Thank you for the work you do.', 'text', $h, 'Thank-you note'),
                self::f('thanks.body', 'Text', 'Your care, time and experience matter. We are grateful you are part of Bahali Connect’s effort to make support easier to find across Caribbean communities and the diaspora.', 'textarea', $h, 'Thank-you note'),
            ]),
            self::section('login', 'Login', 'Provider login page (/login).', [
                self::f('login.seo_title', 'Page Title', 'Provider login'),
                self::f('login.seo_description', 'Meta Description', 'Log in to return to your application or manage your published Bahali Connect profile.', 'textarea'),
                self::f('login.title', 'Card Heading', 'Provider login'),
                self::f('login.email_label', 'Email Label', 'Email address'),
                self::f('login.password_label', 'Password Label', 'Password'),
                self::f('login.button', 'Button', 'Log in to my account'),
                self::f('login.busy', 'Button While Logging In', 'Logging in…'),
                self::f('login.forgot', 'Forgot Password Link', 'Forgot password?'),
                self::f('login.switch', 'Apply Question', 'New to Bahali Connect?'),
                self::f('login.apply', 'Apply Link', 'Apply to join'),
            ]),
            self::section('forgot', 'Forgot Password', '"Reset your password" page (/forgot-password).', [
                self::f('forgot.seo_title', 'Page Title', 'Reset your password'),
                self::f('forgot.seo_description', 'Meta Description', 'Request a link to reset the password for your Bahali Connect provider account.', 'textarea'),
                self::f('forgot.title', 'Card Heading', 'Reset your password'),
                self::f('forgot.intro', 'Card Text', 'Enter the email address associated with your provider account.', 'textarea', $h),
                self::f('forgot.email_label', 'Email Label', 'Email address'),
                self::f('forgot.email_placeholder', 'Email Placeholder', 'you@example.com'),
                self::f('forgot.button', 'Button', 'Send reset link'),
                self::f('forgot.busy', 'Button While Sending', 'Sending…'),
                self::f('forgot.back', 'Back Link', 'Back to login'),
            ]),
            self::section('reset', 'Choose a New Password', 'Page opened from the reset email.', [
                self::f('reset.seo_title', 'Page Title', 'Choose a new password'),
                self::f('reset.seo_description', 'Meta Description', 'Choose a new password for your Bahali Connect provider account.', 'textarea'),
                self::f('reset.title', 'Card Heading', 'Choose a new password'),
                self::f('reset.intro', 'Card Text', 'Please enter your new password below.', 'textarea', $h),
                self::f('reset.email_label', 'Email Label', 'Email address'),
                self::f('reset.password_label', 'Password Label', 'New password'),
                self::f('reset.password_placeholder', 'Password Placeholder', 'Enter a new password'),
                self::f('reset.confirm_label', 'Confirm Label', 'Confirm new password'),
                self::f('reset.confirm_placeholder', 'Confirm Placeholder', 'Re-enter the new password'),
                self::f('reset.button', 'Button', 'Reset password'),
                self::f('reset.busy', 'Button While Saving', 'Saving…'),
                self::f('reset.switch', 'Back Question', 'Remembered your password?'),
                self::f('reset.back', 'Back Link', 'Back to login'),
            ]),
        ];
    }
}
