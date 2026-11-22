import { Link } from '@inertiajs/react';
import type { MouseEvent } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { CONNECT_URLS as URLS, CONTACT_EMAIL } from '@/components/connect/links';

/**
 * Privacy Policy, Terms of Use, Directory & Verification and Accessibility Statement
 * (reference LegalPages.jsx → PolicyPage). Wording, effective date and version IDs reviewed by Marsha
 * on 18 November 2026 — keep them as they are (LEGAL_AND_SUPPORT.md).
 */

export type PolicyKind = 'privacy' | 'terms' | 'directory' | 'accessibility';

/* Recorded with a provider's agreement at signup (Terms + Privacy versions). */
export const LEGAL_VERSIONS = {
    terms: 'terms-2026-11-18',
    privacy: 'privacy-2026-11-18',
    directory: 'directory-2026-11-18',
    accessibility: 'accessibility-2026-11-18',
} as const;

const POLICIES: Record<PolicyKind, { title: string; intro: string; sections: [string, string][] }> = {
  privacy: {
    title: "Privacy Policy",
    intro: "Learn what happens to your information when you search for support, list your services or get in touch with Bahali.",
    sections: [
      [
        "Who this policy applies to",
        "Bahali Inc. operates Bahali Connect, a directory of mental health and emotional wellness providers serving Caribbean communities and the diaspora. This policy explains how we handle information when you look for support, apply to join the directory, manage a profile or contact us.",
      ],
      [
        "Looking for support",
        "Accounts are only for providers. When you search or read profiles, we do not ask for your name, email address or phone number. Providers cannot see who viewed their profiles. Bahali does not use your searches to contact you or send you marketing messages.",
      ],
      [
        "Contacting an independent provider",
        "Call opens your phone app, Email opens your email app and Visit website takes you to the provider’s website. Bahali Connect does not handle messages or bookings between you and a provider, and Bahali does not receive a copy of your inquiry. The provider’s privacy practices apply to information you share with them directly.",
      ],
      [
        "Search locations and analytics",
        "Bahali uses aggregate counts to identify gaps in provider coverage and decide where to invite more providers to join. Of the information you enter in a directory search, only the location you select for support is sent to Google Analytics. We do not send your search terms to Google Analytics, including through page URLs or event labels.",
      ],
      [
        "Where you search from",
        "The place you want support may differ from the approximate area you are searching from. For example, if you search from New York for a provider in Jamaica, Jamaica is your selected search location. Analytics reports can also show the approximate area a visit came from. Depending on browser and consent settings, Google Analytics can process technical information such as browser or device details and cookie identifiers to measure visits.",
      ],
      [
        "Provider accounts and public profiles",
        "We use your application information to administer your account, review your application and publish the details you select for your profile. You must give Bahali contact information, including a phone number, and choose how visitors can reach you. Providing a phone number to Bahali does not automatically publish it. Your login email stays separate unless you choose to make it public. If you offer in-person services, your service location is shown. If you offer only virtual services, you can hide your street address.",
      ],
      [
        "Credentials and optional verification",
        "Bahali’s administrative team can review license numbers, copies of licenses, identification and other supporting documents submitted with an application. Identification and supporting documents are not published on your profile. Applying and maintaining an approved profile are free. Bahali is developing an optional credential verification service. If you choose it once available, an administrator will check the relevant public licensing register and may contact the board directly. This will be the only directory fee Bahali charges providers. It covers the administrative cost of the review, and you will see the amount before you decide. Your profile will receive the “Credentials verified” badge only if Bahali independently confirms the credential. Verification is not required to keep an approved listing.",
      ],
      [
        "Questions and concern reports",
        "When you email us, we receive your email address and what you choose to share. You can report a directory concern without giving your name or email. Bahali’s administrative team reviews reports. If we contact the provider, we share the substance of the concern and do not disclose your identity. Someone familiar with the circumstances may still recognize the incident. Include a contact address if you would like a reply. Please leave medical records, passwords and identity documents out of general inquiries and reports.",
      ],
      [
        "Services that support the directory",
        "Hostinger hosts the directory. Google Analytics helps us understand directory use as described above. If you follow a link to an independent provider’s website, that website’s privacy practices apply.",
      ],
      [
        "Removing a listing and deleting provider records",
        "To withdraw your application or remove your profile, email contact@bahali.org. When we process your removal request, we take down any public listing and delete your account, application and credential documents from the active directory system. Privacy correspondence and concern reports are separate records: we keep those for four years. This four-year period does not apply to your provider account, application or credential documents.",
      ],
      [
        "Your privacy questions and requests",
        "To ask about your information, request a correction or deletion, or raise a privacy concern, email contact@bahali.org. Bahali’s administrator monitors this inbox. Tell us which profile or request you are writing about. For information you shared directly with a provider, contact that provider.",
      ],
      ["Changes to this policy", "We will post revisions on this page so you can review how Bahali handles directory information."],
    ],
  },
  terms: {
    title: "Terms of Use",
    intro: "Responsibilities when using Bahali Connect as a visitor or provider.",
    sections: [
      [
        "About the directory",
        "Bahali Connect helps people discover independent mental health and emotional wellness providers. Browsing a profile or contacting a provider does not book an appointment or establish a clinical relationship with Bahali.",
      ],
      [
        "Independent providers and your choices",
        "Providers describe their own services, fees and availability. Confirm current qualifications, location eligibility, service suitability, costs and any insurance arrangements directly. Clinical services and community-based support serve different purposes; their roles should be clearly distinguished.",
      ],
      [
        "Provider accounts and truthful information",
        "Providers must submit accurate information, have authority to offer their listed services in each location and have permission to publish submitted materials. Providers are responsible for protecting their account and keeping public details current. Account creation does not guarantee acceptance or publication.",
      ],
      [
        "Review, changes and removal",
        "Bahali may request clarification, correct information, pause a listing or remove a profile that does not meet directory eligibility or conduct requirements. For questions about an application or listing decision, contact directory@bahali.org.",
      ],
      [
        "Acceptable use",
        "Do not impersonate others, submit misleading credentials, harass people, post unlawful material or attempt unauthorized access. Use reporting tools in good faith and avoid sending unnecessary sensitive information about yourself or others.",
      ],
      [
        "Content and permissions",
        "Submit only content you have the right to use and publish. By submitting information or photographs for a public profile, you permit Bahali to display the materials you select for publication as part of the directory. Do not reuse another provider’s materials without permission.",
      ],
      [
        "Fees and external services",
        "Searching the directory is always free. Applying for and maintaining an approved provider listing are free. Optional credential verification is in development; providers who choose it will see the administrative fee before deciding. Independent providers may charge for their services. External websites, payment arrangements and provider-client agreements are separate from Bahali Connect.",
      ],
      [
        "Service limits and disagreements",
        "Availability and profile information can change. A listing or review label does not guarantee quality, suitability, availability or results. Confirm arrangements directly with the provider. Contact Bahali about directory concerns; concerns about professional practice may also be raised with the relevant licensing body or authority.",
      ],
      [
        "Acceptance and updates",
        "Providers must agree to the Terms of Use when creating an account. Bahali may update these terms and will publish the current version on this page with its effective date.",
      ],
      [
        "Questions",
        "Use Contact for questions about directory use or provider accounts. Use Report a concern for inaccurate profiles, concerns about credentials or inappropriate conduct.",
      ],
    ],
  },
  directory: {
    title: "Directory & Verification",
    intro: "What profile information and review labels can\u2014and cannot\u2014tell you.",
    sections: [
      [
        "A starting point for finding support",
        "The directory presents information about independent providers. A listing is not a recommendation of one provider over another, a guarantee of quality or a promise of availability or results. Confirm services and suitability directly before making arrangements.",
      ],
      [
        "Profile reviewed",
        "Bahali has reviewed the profile for directory eligibility and completeness. Profile review does not mean that a professional license or credential has been independently verified. Only a separate “Credentials verified” badge indicates that Bahali has independently confirmed the specified credential.",
      ],
      [
        "Credentials verified",
        "Optional credential verification is in development. Applying and maintaining an approved profile are free. Once verification is available, providers who choose it will see the administrative review fee before deciding. The “Credentials verified” badge will appear only after Bahali independently confirms the specified credential. Paying for a review does not guarantee a badge. The badge applies only to the credential checked.",
      ],
      [
        "Caribbean support experience",
        "This label reflects the provider\u2019s own report of experience supporting Caribbean individuals, families or communities, including the diaspora. It is not a certification or an inference about ethnicity. Providers from all backgrounds are welcome.",
      ],
      [
        "Different forms of support",
        "Clinical, counseling, peer, pastoral, allied and other community support roles are not interchangeable. Review each provider\u2019s role, qualifications and actual services. A professional title or badge should not imply a scope of practice the provider does not hold.",
      ],
      [
        "Information that may change",
        "Fees, insurance, locations, accessibility and availability are supplied by providers and may change. Check current arrangements directly. Virtual support must be available for your location, rather than simply offered somewhere.",
      ],
      [
        "Reporting concerns",
        "Use Report a concern to flag an inaccurate profile, misleading credentials, inappropriate conduct or a privacy issue. Directory reporting is separate from a complaint to a relevant licensing body or other authority. Bahali’s administrative team reviews reports and may contact the provider about the substance of a concern. You can report without giving your name or email. If you provide your identity, Bahali does not disclose it to the provider.",
      ],
      [
        "Urgent help",
        "Bahali Connect\u2019s directory and support forms are not emergency services and are not monitored for urgent help. If there is immediate danger, contact emergency services where you are.",
      ],
    ],
  },
  accessibility: {
    title: "Accessibility Statement",
    intro: "Finding support should be accessible. Tell us if something makes the directory difficult to use.",
    sections: [
      [
        "Our commitment",
        "Bahali Connect aims to make its search, profiles and provider tools usable by people with disabilities. We aim to align with WCAG 2.2 Level AA. This is an accessibility goal, not a claim of independently tested conformance.",
      ],
      [
        "Accessibility features",
        "The website includes labeled fields, keyboard-operable controls, visible focus indicators, a skip-to-content link, responsive layouts and reduced-motion support.",
      ],
      [
        "Current limitations",
        "A formal independent accessibility audit has not been completed. Third-party websites may have different accessibility features. If any part of Bahali Connect is difficult to use, please tell us so we can investigate and help you find another way to access the information.",
      ],
      [
        "Ask for help or report a barrier",
        "Use Contact \u2192 Accessibility or technical issue. Tell us the page address, what you were trying to do, what happened and your preferred way to receive a reply. Device and assistive-technology details are optional. Do not include medical records or passwords.",
      ],
      [
        "Alternative contact and response process",
        "If you cannot use a website feature or form, email contact@bahali.org. Describe the information or assistance you need and your preferred way to receive a reply. Bahali’s administrator monitors this inbox.",
      ],
      ["Keeping this statement current", "We will review this statement as the website changes and publish updates on this page."],
    ],
  },
};

/* "On this page" links: scroll the heading below the sticky header and move focus to it. */
function jump(e: MouseEvent<HTMLAnchorElement>, i: number) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const heading = document.querySelector<HTMLElement>('#policy-' + i + ' h2');
    if (!heading) return;
    window.history.replaceState(window.history.state, '', '#policy-' + i);
    const offset = (document.querySelector('.bc-connect header')?.getBoundingClientRect().height || 0) + 20;
    window.scrollTo({ top: window.scrollY + heading.getBoundingClientRect().top - offset, behavior: 'instant' as ScrollBehavior });
    heading.focus({ preventScroll: true });
}

export default function Policy({ kind }: { kind: PolicyKind }) {
    const p = POLICIES[kind];
    const contactHref = URLS.contact + (kind === 'privacy' ? '?topic=privacy' : kind === 'accessibility' ? '?topic=accessibility' : '');

    return (
        <ConnectLayout page={kind} title={p.title} description={p.intro}>
            <section className="page-intro policy-intro">
                <div className="wrap">
                    <p className="eyebrow">INFORMATION &amp; YOUR CHOICES</p>
                    <h1>{p.title}</h1>
                    <p className="lead">{p.intro}</p>
                    <p className="policy-effective">Effective November 18, 2026</p>
                </div>
            </section>
            <div className="wrap policy-layout">
                <aside className="policy-toc">
                    <strong>On this page</strong>
                    {p.sections.map(([title], i) => (
                        <a key={title} href={'#policy-' + i} onClick={(e) => jump(e, i)}>
                            {title}
                        </a>
                    ))}
                    <Link href={URLS.contact}>Contact Connect</Link>
                </aside>
                <article className="policy-copy">
                    {p.sections.map(([title, body], i) => (
                        <section id={'policy-' + i} key={title}>
                            <h2 tabIndex={-1}>{title}</h2>
                            <p>
                                {body.includes(CONTACT_EMAIL) ? (
                                    <>
                                        {body.split(CONTACT_EMAIL)[0]}
                                        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                                        {body.split(CONTACT_EMAIL)[1]}
                                    </>
                                ) : (
                                    body
                                )}
                            </p>
                        </section>
                    ))}
                    <div className="policy-help">
                        <h2>Need help with the directory?</h2>
                        <div className="button-row">
                            <Link href={contactHref} className="button">
                                {kind === 'privacy' ? 'Ask a privacy question' : kind === 'accessibility' ? 'Report an accessibility barrier' : 'Contact Connect'}
                            </Link>
                            <Link href={URLS.report}>Report a concern</Link>
                        </div>
                    </div>
                </article>
            </div>
        </ConnectLayout>
    );
}
