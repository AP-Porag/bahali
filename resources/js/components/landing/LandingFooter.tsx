import { Link } from '@inertiajs/react';
import FooterCredit from '../madbrain';
import '../../../css/landing.css';
import { DISCLAIMER_URL, PRIVACY_URL, URGENT_SUPPORT_URL } from './links';

/**
 * Bahali Connect footer (Version 3.7 design from Marsha).
 * Used by the landing page, privacy, disclaimer and urgent-support pages (through LandingLayout),
 * and can be dropped into any other page:
 *
 *     import LandingFooter from '@/components/landing/LandingFooter';
 *     ...
 *     <LandingFooter />
 *
 * The footer brings its own styles (resources/css/landing.css). The `bc-landing bc-landing-footer`
 * wrapper turns those styles on for the footer only, so the rest of the page is not affected.
 */
export default function LandingFooter() {
    return (
        <div className="bc-landing bc-landing-footer">
            <footer>
                <span>Bahali Provider Directory</span>

                <nav className="footer-links" aria-label="Footer">
                    <span>
                        Directory contact: <a href="mailto:directory@bahali.org">directory@bahali.org</a>
                    </span>
                    {/* Privacy Policy: DRAFT — legal sign-off needed. Must be live before the provider application collects any information. */}
                    <Link href={PRIVACY_URL}>Privacy Policy</Link>
                    {/* Directory Disclaimer: DRAFT pending legal review. */}
                    <Link href={DISCLAIMER_URL}>Directory Disclaimer</Link>
                    {/* Need urgent support?: emergency and crisis numbers, checked November 2026. */}
                    <Link href={URGENT_SUPPORT_URL}>Need urgent support?</Link>
                    <a href="https://bahali.org">Visit bahali.org →</a>
                </nav>

                <span>Because every mind deserves peace.</span>

                <div className="footer-bottom footer-bottom-row">
                    <span>© 2026 Bahali Inc.</span>
                    <FooterCredit text="Technology Partner" />
                </div>
            </footer>
        </div>
    );
}
