import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { Rich, reader, type ConnectContent } from '@/components/connect/content';
import { BAHALI_URL, CONNECT_URLS as URLS } from '@/components/connect/links';

/* About Connect (reference src.jsx → AboutPage). Introduction photograph: 16:10 (IMAGE_GUIDE.md). */
export default function About({ content }: { content?: ConnectContent }) {
    const t = reader(content);

    return (
        <ConnectLayout page="about" title={t('seo.title')} description={t('seo.description')}>
            <section className="page-intro">
                <div className="wrap about-image-intro">
                    <div>
                        <p className="eyebrow">{t('intro.eyebrow')}</p>
                        <h1>
                            <Rich text={t('intro.title')} />
                        </h1>
                        <p className="lead">
                            <Rich text={t('intro.lead')} />
                        </p>
                    </div>
                    <figure className="connect-photo" style={{ ['--photo-ratio' as string]: '16 / 10' }}>
                        <img src={t('intro.image')} alt={t('intro.image_alt')} width="1600" height="1000" />
                    </figure>
                </div>
            </section>

            <section className="section wrap editorial">
                <h2>
                    <Rich text={t('why.title')} />
                </h2>
                <p>
                    <Rich text={t('why.p1')} />
                </p>
                <p>
                    <Rich text={t('why.p2')} />
                </p>
                <p>
                    <Rich text={t('why.p3')} />
                </p>
                <h2>
                    <Rich text={t('profile.title')} />
                </h2>
                <p>
                    <Rich text={t('profile.p1')} />
                </p>
                <p>
                    <Rich text={t('profile.p2')} />
                </p>
                <Link href={URLS.directory}>{t('profile.link')}</Link>
                <h2>
                    <Rich text={t('bahali.title')} />
                </h2>
                <p>
                    <Rich text={t('bahali.body')} />
                </p>
                <h3>{t('bahali.mission_title')}</h3>
                <p>
                    <Rich text={t('bahali.mission')} />
                </p>
                <h3>{t('bahali.vision_title')}</h3>
                <p>
                    <Rich text={t('bahali.vision')} />
                </p>
                <a href={BAHALI_URL} target="_blank" rel="noreferrer">
                    {t('bahali.link')}
                </a>
            </section>
        </ConnectLayout>
    );
}
