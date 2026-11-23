import { router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { SearchSelect } from '@/components/connect/SearchSelect';
import { Rich, fill, reader, type ConnectContent } from '@/components/connect/content';
import { CONNECT_URLS as URLS } from '@/components/connect/links';
import { subregionLabel, subregionsOf, type ConnectCountry, type ConnectFilters, type ConnectTopic } from '@/components/connect/types';

/**
 * Get Help — topic → location → results (reference HelpPage.jsx, GET_HELP_FINAL_HANDOFF.md).
 * Topics and aliases come from App\Support\ConnectTaxonomy (mapped to the approved areas of support);
 * countries and parishes come from the existing location tables.
 * The choice is posted, so the topic never enters the page address.
 */
interface Props {
    countries: ConnectCountry[];
    topics: ConnectTopic[];
    filters: ConnectFilters;
    content?: ConnectContent;
}

const isPhone = () => window.matchMedia('(max-width:850px)').matches;

/* On phones, choosing a topic moves to the location panel and its heading (keyboard + screen reader). */
const focusLocation = () => {
    if (!isPhone()) return;
    requestAnimationFrame(() => {
        document.querySelector('.help-location')?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
        document.getElementById('help-location-heading')?.focus({ preventScroll: true });
    });
};

export default function GetHelp({ countries, topics, filters, content }: Props) {
    const t = reader(content);
    const [showAll, setShowAll] = useState(false);
    const [query, setQuery] = useState('');
    const [chosen, setChosen] = useState(filters.topic);
    const [place, setPlace] = useState(filters.country);
    const [region, setRegion] = useState(filters.region);
    const [all, setAll] = useState(false);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    const q = query.toLowerCase().trim();
    const matching = topics.filter((t) => (t.name + ' ' + t.terms).toLowerCase().includes(q));
    const list = q || showAll ? matching : matching.slice(0, 6);
    const regions = subregionsOf(countries, place);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!all && !place) {
            setError(t('location.error'));
            document.getElementById('help-country')?.focus();
            return;
        }
        router.post(
            URLS.results,
            { country: all ? '' : place, region: all ? '' : region, topic: chosen, virtual: false, language: '', role: '' },
            { onStart: () => setBusy(true), onFinish: () => setBusy(false) },
        );
    };

    return (
        <ConnectLayout page="help" title={t('seo.title')} description={t('seo.description')}>
            <section className="page-intro help-intro">
                <div className="wrap">
                    <p className="eyebrow">{t('intro.eyebrow')}</p>
                    <h1>
                        <Rich text={t('intro.title')} />
                    </h1>
                    <p className="lead">
                        <Rich text={t('intro.lead')} />
                    </p>
                </div>
            </section>

            <section className="wrap help-layout">
                <div>
                    <label className="discovery-search" htmlFor="topic-search">
                        {t('topics.search_label')}
                        <input
                            id="topic-search"
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('topics.search_placeholder')}
                        />
                    </label>
                    <div className="topic-results" aria-live="polite">
                        {list.length ? (
                            <p className="small muted">{t('topics.hint')}</p>
                        ) : (
                            <p>{t('topics.none')}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        className="text-button"
                        onClick={() => {
                            setChosen('');
                            setQuery('');
                            focusLocation();
                        }}
                    >
                        {t('topics.all')}
                    </button>
                    <div className="topic-list">
                        {list.map((topic) => (
                            <button
                                type="button"
                                className={'topic-option ' + (chosen === topic.name ? 'selected' : '')}
                                aria-pressed={chosen === topic.name}
                                key={topic.name}
                                onClick={() => {
                                    setChosen(topic.name);
                                    focusLocation();
                                }}
                            >
                                <span className="topic-title">{topic.name}</span>
                                <span>{topic.description}</span>
                                <span className="topic-select">{chosen === topic.name ? t('topics.selected') : t('topics.select')}</span>
                            </button>
                        ))}
                    </div>
                    {!q && (
                        <button type="button" className="text-button topic-expand" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
                            {showAll ? t('topics.fewer') : fill(t('topics.more'), { count: topics.length })}
                        </button>
                    )}
                </div>

                <aside className="help-location">
                    {chosen && (
                        <button
                            type="button"
                            className="text-button help-change-topic"
                            onClick={() => {
                                document.getElementById('topic-search')?.focus();
                                document.querySelector('.discovery-search')?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior });
                            }}
                        >
                            {t('location.change')}
                        </button>
                    )}
                    <p className="eyebrow">{t('location.eyebrow')}</p>
                    <h2 id="help-location-heading" tabIndex={-1}>
                        {chosen ? fill(t('location.title_topic'), { topic: chosen.toLowerCase() }) : t('location.title')}
                    </h2>
                    <p>
                        <Rich text={t('location.body')} />
                    </p>
                    <form onSubmit={submit} noValidate>
                        <label htmlFor="help-country">{t('location.country_label')}</label>
                        <SearchSelect
                            id="help-country"
                            disabled={all}
                            invalid={!!error}
                            describedBy={error ? 'help-country-error' : undefined}
                            value={place}
                            onChange={(v) => {
                                setPlace(v);
                                setRegion(''); // changing country clears the incompatible parish/region
                                setError('');
                            }}
                            options={countries.map((c) => c.name)}
                            placeholder={t('location.country_placeholder')}
                            searchPlaceholder={t('location.country_search')}
                        />
                        {error && (
                            <p id="help-country-error" className="error" role="alert">
                                {error}
                            </p>
                        )}
                        {!all && place && regions.length > 0 && (
                            <label htmlFor="help-region">
                                {subregionLabel(countries, place)} <span className="small muted">{t('location.optional')}</span>
                                <SearchSelect
                                    id="help-region"
                                    value={region}
                                    onChange={setRegion}
                                    options={regions.map((r) => r.name)}
                                    allLabel={fill(t('location.region_all'), { place })}
                                    searchPlaceholder={fill(t('location.region_search'), { area: subregionLabel(countries, place).toLowerCase() })}
                                />
                            </label>
                        )}
                        <details className="all-location-choice">
                            <summary>{t('all.summary')}</summary>
                            <label className="check-label">
                                <input
                                    type="checkbox"
                                    checked={all}
                                    onChange={(e) => {
                                        setAll(e.target.checked);
                                        setError('');
                                    }}
                                />
                                {t('all.checkbox')}
                            </label>
                            <p className="small">
                                <Rich text={t('all.note')} />
                            </p>
                        </details>
                        <button className="button" type="submit" disabled={busy}>
                            {busy ? t('submit.busy') : chosen ? t('submit.topic') : t('submit.default')}
                        </button>
                        <p className="small muted">
                            <Rich text={t('submit.note')} />
                        </p>
                        <p className="help-urgent-link">
                            <Rich text={t('submit.urgent')} />
                        </p>
                    </form>
                </aside>
            </section>

            <section className="wrap help-reassurance">
                <h2>
                    <Rich text={t('reassurance.title')} />
                </h2>
                <p>
                    <Rich text={t('reassurance.body')} />
                </p>
            </section>
        </ConnectLayout>
    );
}
