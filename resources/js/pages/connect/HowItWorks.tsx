import { Link } from '@inertiajs/react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { CONNECT_URLS as URLS } from '@/components/connect/links';

/**
 * How it works (reference src.jsx → HowPage). Text-only hero (IMAGE_GUIDE.md).
 * The clearly labeled illustrative profile is an educational example and may stay (IMPLEMENTATION.md).
 */
export default function HowItWorks() {
    return (
        <ConnectLayout page="how" title="How it works" description="Take time to explore, ask questions and decide what feels right for you.">
            <section className="page-intro how-intro">
                <div className="wrap">
                    <p className="eyebrow">HOW IT WORKS</p>
                    <h1>
                        One step at a time.
                        <br />
                        <em>Your choice, your pace.</em>
                    </h1>
                    <p className="lead">Take time to explore, ask questions and decide what feels right for you.</p>
                    <Link className="button" href={URLS.browse}>
                        Find support
                    </Link>
                </div>
            </section>

            <section className="section wrap how how-page">
                <h2>Search, compare and reach out.</h2>
                <div>
                    {[
                        [
                            '01',
                            'Start where you are',
                            'Choose the country or territory where you would like support. If you are unsure what to select next, you can browse all support options.',
                        ],
                        [
                            '02',
                            'Compare what matters to you',
                            'Read about who each provider supports, how they work and what they charge. Look for the details that matter to you, such as language or meeting options.',
                        ],
                        [
                            '03',
                            'Ask about the next step',
                            'You can ask what a first meeting would be like and whether the provider has experience with your concerns. You and the provider arrange any appointment directly.',
                        ],
                    ].map(([n, t, b]) => (
                        <div className="step" key={n}>
                            <span className="step-number">{n}</span>
                            <div>
                                <h3>{t}</h3>
                                <p>{b}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div id="illustrative-profile" className="preview-card">
                    <div className="small-cap">Illustrative profile · Fictional provider</div>
                    <div className="mini-top">
                        <div className="avatar" aria-hidden="true">
                            NB
                        </div>
                        <div>
                            <h3>Naomi Bennett</h3>
                            <p>Community support facilitator</p>
                            <p className="example-location">St. Elizabeth, Jamaica · In person</p>
                        </div>
                    </div>
                    <dl className="example-details">
                        <div>
                            <dt>Who I support</dt>
                            <dd>Adults caring for an aging parent or another older family member.</dd>
                        </div>
                        <div>
                            <dt>What I offer</dt>
                            <dd>
                                I lead a peer support group where caregivers can talk about what is on their minds and share what has helped them day to
                                day.
                            </dd>
                        </div>
                        <div>
                            <dt>Group details</dt>
                            <dd>Twice a month · In English · Free to attend</dd>
                        </div>
                    </dl>
                    <div className="mini-bottom">
                        <Link className="text-button" href={URLS.browse}>
                            Explore the directory
                        </Link>
                    </div>
                </div>
            </section>

            <section className="wrap information-grid">
                <article>
                    <h3>Not sure where to start?</h3>
                    <p>Start with what you would like help with. You do not need to know a provider’s professional title to explore the support they offer.</p>
                </article>
                <article>
                    <h3>Still looking for a good fit?</h3>
                    <p>
                        Try adjusting the type of support, language or meeting format in your search. Your chosen location stays the same unless you
                        change it.
                    </p>
                </article>
                <article>
                    <h3>Wondering what to ask?</h3>
                    <p>
                        You can ask about fees, availability and what a first meeting is like. You might also ask about their experience with concerns like
                        yours.
                    </p>
                </article>
            </section>
        </ConnectLayout>
    );
}
