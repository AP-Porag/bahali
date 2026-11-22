import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { BAHALI_URL, CONNECT_URLS as URLS } from '@/components/connect/links';

/* About Connect (reference src.jsx → AboutPage). Introduction photograph: 16:10 (IMAGE_GUIDE.md). */
export default function About() {
    return (
        <ConnectLayout
            page="about"
            title="About Connect"
            description="Bahali Connect makes mental health care and community support easier to find for Caribbean communities and the diaspora."
        >
            <section className="page-intro">
                <div className="wrap about-image-intro">
                    <div>
                        <p className="eyebrow">ABOUT BAHALI CONNECT</p>
                        <h1>
                            Connection rooted
                            <br />
                            in <em>understanding.</em>
                        </h1>
                        <p className="lead">
                            Bahali Connect makes mental health care and community support easier to find for Caribbean communities and the diaspora.
                        </p>
                    </div>
                    <figure className="connect-photo" style={{ ['--photo-ratio' as string]: '16 / 10' }}>
                        <img
                            src="/images/connect/everyday-connection.jpg"
                            alt="Two women sitting on the grass, talking and smiling at each other."
                            width="1600"
                            height="1000"
                        />
                    </figure>
                </div>
            </section>

            <section className="section wrap editorial">
                <h2>Why we created Bahali Connect</h2>
                <p>
                    If you have been taught to keep personal struggles to yourself or feel you should manage on your own, asking for support can feel
                    unfamiliar. You deserve care, and seeking it is a sign of strength.
                </p>
                <p>
                    We created Bahali Connect as part of Bahali’s mission to reduce mental health stigma and improve access to care and support.
                    Bringing provider information into one place makes it easier to explore your options and reach out when you are ready.
                </p>
                <p>
                    We welcome providers from all backgrounds. If you would like to find someone with experience supporting Caribbean individuals or
                    families, you can read how providers describe that work in their own words.
                </p>
                <h2>What a profile can tell you</h2>
                <p>
                    Each profile tells you who the provider supports, what they offer and how to reach them. Details such as languages spoken, fees and
                    options for meeting in person or virtually can help you decide whom you would like to contact.
                </p>
                <p>
                    <strong>Profile Reviewed</strong> means Bahali reviewed the profile for inclusion in the directory. It does not mean Bahali
                    independently verified the provider’s credentials.
                </p>
                <Link href={URLS.directory}>What the profile badges mean</Link>
                <h2>A service of Bahali</h2>
                <p>
                    Bahali Connect is a service of Bahali, a nonprofit working to make conversations about mental health more open and support more
                    accessible.
                </p>
                <h3>Our mission</h3>
                <p>
                    To promote emotional well-being, reduce mental health stigma and improve access to culturally grounded resources, care and support
                    across Caribbean communities and the diaspora.
                </p>
                <h3>Our vision</h3>
                <p>
                    A future where Caribbean communities and the global diaspora can speak openly about mental health and access the care and support
                    they need.
                </p>
                <a href={BAHALI_URL} target="_blank" rel="noreferrer">
                    Visit Bahali.org
                </a>
            </section>
        </ConnectLayout>
    );
}
