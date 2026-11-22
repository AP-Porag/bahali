import { Link } from '@inertiajs/react';
import type { MouseEvent, ReactNode } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { CONNECT_URLS as URLS } from '@/components/connect/links';

/* Provider Spotlight Policy (reference SpotlightPolicyPage.jsx) — effective 18 November 2026. */

const SECTIONS: [string, ReactNode][] = [
  [
    "How providers are selected",
    <>
      <p>Bahali’s administrative team considers:</p>
      <ul>
        <li>
          <strong>Usefulness to readers:</strong> The feature explains a service, approach or support need relevant to Bahali Connect’s
          audience.
        </li>
        <li>
          <strong>Clear, current information:</strong> The provider has an approved, published directory profile and can accurately describe
          their qualifications, experience and services.
        </li>
        <li>
          <strong>Variety over time:</strong> Features represent different provider roles, locations, services and communities served.
        </li>
      </ul>
      <p>
        Providers from all backgrounds may be considered. Experience supporting Caribbean communities is understood through the provider’s
        description of their work, rather than assumptions about their identity.
      </p>
      <p>
        Providers may express interest by emailing <a href="mailto:directory@bahali.org">directory@bahali.org</a>. Expressing interest does
        not guarantee selection. Publication depends on editorial priorities and team capacity; there is no guaranteed schedule or
        entitlement to a feature.
      </p>
    </>,
  ],
  [
    "No paid preference",
    <>
      <p>There is no charge to participate. Providers cannot purchase a spotlight, priority placement or favorable coverage.</p>
      <p>
        Credential verification, verification badges, donations, sponsorships and other financial contributions do not influence selection.
        Providers with and without a verification badge may be considered.
      </p>
      <p>
        Participation is optional. Accepting or declining a spotlight does not affect a provider’s application review, directory listing or
        eligibility for credential verification.
      </p>
    </>,
  ],
  [
    "Permission and use of materials",
    <>
      <p>
        Before publication, Bahali obtains written permission covering participation, the materials used and the channels where the feature
        may appear. Use beyond that permission requires additional agreement.
      </p>
      <p>
        Providers must have the right to share photographs and other materials they submit. Spotlights do not include identifiable client
        information, client stories or client testimonials.
      </p>
      <p>
        The provider reviews the proposed feature for factual accuracy and confirms permission to publish. Bahali retains editorial
        responsibility for the final wording, presentation and publication decision. Material changes made after confirmation are shared
        with the provider for renewed approval before publication.
      </p>
    </>,
  ],
  [
    "Accuracy and transparency",
    <>
      <p>
        Features must describe qualifications, experience and services accurately. They must not contain unsupported clinical claims,
        guarantees of results or misleading statements about credentials.
      </p>
      <p>
        Bahali checks the proposed feature against the directory profile and seeks clarification where needed. This editorial review does
        not constitute independent credential verification.
      </p>
      <p>
        A relevant personal, professional or financial relationship between a featured provider and Bahali is disclosed in the feature. A
        team member with a conflict of interest does not make the selection decision alone. If an impartial review cannot be arranged, the
        feature is deferred.
      </p>
    </>,
  ],
  [
    "What a spotlight means",
    <>
      <p>
        A spotlight is an introduction to a provider’s work. It is not an endorsement, ranking, clinical recommendation or guarantee of
        quality, availability or results. Selection does not imply that a featured provider is more qualified or suitable than another
        provider.
      </p>
      <p>
        Being featured does not verify credentials or confer a verification badge. Readers should review the provider’s profile and confirm
        services, qualifications, fees and suitability directly.
      </p>
    </>,
  ],
  [
    "Corrections, updates and removal",
    <>
      <p>
        Providers are expected to tell Bahali when a material detail in their feature changes. Providers and readers may report inaccuracies
        or concerns to <a href="mailto:directory@bahali.org">directory@bahali.org</a>.
      </p>
      <p>
        Bahali may correct, update, pause or remove a feature when information changes, a directory profile is unpublished or a concern
        requires review. Pausing a feature during review does not imply that a concern has been substantiated.
      </p>
      <p>
        Providers may withdraw permission for future promotion or request removal from channels Bahali controls. Bahali will stop new
        promotion and process the removal request as promptly as reasonably possible. Bahali cannot guarantee removal of material already
        distributed, cached or shared by others.
      </p>
    </>,
  ],
  [
    "Contact",
    <p>
      For spotlight inquiries, permissions, corrections or removal requests, email{" "}
      <a href="mailto:directory@bahali.org">directory@bahali.org</a>.
    </p>,
  ],
];

function jump(e: MouseEvent<HTMLAnchorElement>, i: number) {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const h = document.getElementById('spotlight-policy-' + i);
    if (!h) return;
    const top = window.scrollY + h.getBoundingClientRect().top - (document.querySelector('.bc-connect header')?.getBoundingClientRect().height || 0) - 20;
    window.history.replaceState(window.history.state, '', '#spotlight-policy-' + i);
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
    h.focus({ preventScroll: true });
}

export default function SpotlightPolicy() {
    return (
        <ConnectLayout
            page="spotlight"
            title="Provider Spotlight Policy"
            description="How Bahali selects, prepares and publishes provider spotlights. There is no charge and no paid preference."
        >
            <section className="page-intro policy-intro">
                <div className="wrap">
                    <p className="eyebrow">PROVIDER INFORMATION</p>
                    <h1>Bahali Connect Provider Spotlight Policy</h1>
                    <p className="policy-effective">
                        <em>
                            Effective <time dateTime="2026-11-18">November 18, 2026</time>
                        </em>
                    </p>
                    <p className="lead">
                        Provider spotlights introduce readers to the work of providers listed on Bahali Connect. They help readers learn about different
                        services, approaches and forms of support across Caribbean communities and the diaspora.
                    </p>
                </div>
            </section>
            <div className="wrap policy-layout">
                <aside className="policy-toc">
                    <strong>On this page</strong>
                    {SECTIONS.map(([title], i) => (
                        <a key={title} href={'#spotlight-policy-' + i} onClick={(e) => jump(e, i)}>
                            {title}
                        </a>
                    ))}
                    <Link href={URLS.providers}>For Providers</Link>
                </aside>
                <article className="policy-copy">
                    {SECTIONS.map(([title, body], i) => (
                        <section key={title}>
                            <h2 id={'spotlight-policy-' + i} tabIndex={-1}>
                                {title}
                            </h2>
                            {body}
                        </section>
                    ))}
                    <p className="policy-update-note">
                        Bahali may update this policy as its spotlight program develops. The current version will be published on this page, with the
                        date of the most recent revision.
                    </p>
                </article>
            </div>
        </ConnectLayout>
    );
}
