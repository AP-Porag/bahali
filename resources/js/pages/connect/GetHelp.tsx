import { Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

import ConnectLayout from '@/components/connect/ConnectLayout';
import { SearchSelect } from '@/components/connect/SearchSelect';
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

export default function GetHelp({ countries, topics, filters }: Props) {
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
            setError('Choose where you would receive support, or explore across all locations.');
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
        <ConnectLayout
            page="help"
            title="Get Help"
            description="You do not need a diagnosis or the perfect words. Start with a concern, or explore all support options."
        >
            <section className="page-intro help-intro">
                <div className="wrap">
                    <p className="eyebrow">GET HELP</p>
                    <h1>
                        What would you like
                        <br />
                        <em>support with?</em>
                    </h1>
                    <p className="lead">You do not need a diagnosis or the perfect words. Start with a concern, or explore all support options.</p>
                </div>
            </section>

            <section className="wrap help-layout">
                <div>
                    <label className="discovery-search" htmlFor="topic-search">
                        Find an area of support
                        <input
                            id="topic-search"
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Try depression, worry or caregiver stress"
                        />
                    </label>
                    <div className="topic-results" aria-live="polite">
                        {list.length ? (
                            <p className="small muted">Choose a topic, or continue without one.</p>
                        ) : (
                            <p>No matching topic yet. Try a shorter phrase, or explore all support options.</p>
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
                        Explore all support options
                    </button>
                    <div className="topic-list">
                        {list.map((t) => (
                            <button
                                type="button"
                                className={'topic-option ' + (chosen === t.name ? 'selected' : '')}
                                aria-pressed={chosen === t.name}
                                key={t.name}
                                onClick={() => {
                                    setChosen(t.name);
                                    focusLocation();
                                }}
                            >
                                <span className="topic-title">{t.name}</span>
                                <span>{t.description}</span>
                                <span className="topic-select">{chosen === t.name ? 'Selected' : 'Select topic'}</span>
                            </button>
                        ))}
                    </div>
                    {!q && (
                        <button type="button" className="text-button topic-expand" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
                            {showAll ? 'Show fewer areas of support' : `See all ${topics.length} areas of support`}
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
                            Change topic
                        </button>
                    )}
                    <p className="eyebrow">YOUR NEXT STEP</p>
                    <h2 id="help-location-heading" tabIndex={-1}>
                        {chosen ? 'Support with ' + chosen.toLowerCase() : 'Explore your options'}
                    </h2>
                    <p>Choose where you would receive support. You can refine by language, type of service and virtual options on the results page.</p>
                    <form onSubmit={submit} noValidate>
                        <label htmlFor="help-country">Country or territory</label>
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
                            placeholder="Select a location"
                            searchPlaceholder="Search countries and territories"
                        />
                        {error && (
                            <p id="help-country-error" className="error" role="alert">
                                {error}
                            </p>
                        )}
                        {!all && place && regions.length > 0 && (
                            <label htmlFor="help-region">
                                {subregionLabel(countries, place)} <span className="small muted">(optional)</span>
                                <SearchSelect
                                    id="help-region"
                                    value={region}
                                    onChange={setRegion}
                                    options={regions.map((r) => r.name)}
                                    allLabel={`All areas in ${place}`}
                                    searchPlaceholder={`Search ${subregionLabel(countries, place).toLowerCase()}`}
                                />
                            </label>
                        )}
                        <details className="all-location-choice">
                            <summary>Explore across all locations</summary>
                            <label className="check-label">
                                <input
                                    type="checkbox"
                                    checked={all}
                                    onChange={(e) => {
                                        setAll(e.target.checked);
                                        setError('');
                                    }}
                                />
                                Show profiles in all locations
                            </label>
                            <p className="small">
                                This is a directory-wide view. A listing does not mean the provider can offer services where you are. Choose a location to
                                narrow your options.
                            </p>
                        </details>
                        <button className="button" type="submit" disabled={busy}>
                            {busy ? 'Finding support…' : chosen ? 'Find support for this concern' : 'Find support'}
                        </button>
                        <p className="small muted">Free to search. Accounts are only for providers.</p>
                        <p className="help-urgent-link">
                            Looking for crisis support? <Link href={URLS.urgent}>Visit Urgent Help</Link>.
                        </p>
                    </form>
                </aside>
            </section>

            <section className="wrap help-reassurance">
                <h2>A first look is a step forward.</h2>
                <p>You can read profiles, ask questions and take time to decide. You do not have to contact anyone before you feel ready.</p>
            </section>
        </ConnectLayout>
    );
}
