/**
 * Bahali Connect — page addresses (Marsha's handoff, 18 November 2026).
 * The reference used trailing slashes (/get-help/); Laravel routes have none.
 * Provider login / signup / account point at the existing account system.
 */
export const CONNECT_URLS = {
    home: '/',
    help: '/get-help',
    results: '/find-support',
    // "Browse providers" always starts a fresh browse view: the topic, role, language and virtual
    // preference are cleared, the chosen country and parish stay (GET_HELP_FINAL_HANDOFF.md).
    browse: '/find-support?browse=1',
    profile: (id: number | string) => `/provider-profile/${id}`,
    providers: '/for-providers',
    signup: '/provider/directory/create', // existing provider application (email code, draft, review)
    login: '/login', // existing provider login
    account: '/provider/dashboard', // existing provider dashboard
    editProfile: '/provider/profile/edit', // existing provider profile editor
    logout: '/logout', // Laravel logout (POST)
    how: '/how-it-works',
    about: '/about',
    blog: '/blog',
    contact: '/contact',
    report: '/report-a-concern',
    privacy: '/privacy',
    terms: '/terms',
    directory: '/directory-verification',
    accessibility: '/accessibility',
    spotlight: '/provider-spotlight-policy',
    urgent: '/urgent-help',
} as const;

export const BAHALI_URL = 'https://bahali.org/';
export const RESOURCE_HUB_URL = 'https://bahali.org/bahali-resource-hub/';
export const HELPLINE_URL = 'https://findahelpline.com/';
export const DIRECTORY_EMAIL = 'directory@bahali.org';
export const CONTACT_EMAIL = 'contact@bahali.org';
