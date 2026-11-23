import { router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

import { reader, type ConnectContent } from './content';
import Icon from './Icon';
import { SearchSelect } from './SearchSelect';
import { CONNECT_URLS as URLS } from './links';
import { type ConnectCountry, type ConnectFilters, type ConnectTopic } from './types';

/**
 * "Search for support" — homepage (full) and results page (compact) versions from the reference.
 * Submits with POST so the chosen area of support never appears in the page address;
 * the server keeps it in the session and opens /find-support.
 */
export default function SearchForm({
    compact = false,
    countries,
    topics,
    filters,
    text,
}: {
    compact?: boolean;
    countries: ConnectCountry[];
    topics: ConnectTopic[];
    filters: ConnectFilters;
    /** Homepage CMS text (search.* fields); built-in wording is used when a field is missing. */
    text?: ConnectContent;
}) {
    const read = reader(text);
    const t = (key: string, fallback: string) => read(`search.${key}`) || fallback;
    const [country, setCountry] = useState(filters.country);
    const [topic, setTopic] = useState(filters.topic);
    const [feedback, setFeedback] = useState('');
    const [busy, setBusy] = useState(false);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (!country && !compact) {
            setFeedback(t('error', 'Choose where you will receive support to see relevant options.'));
            document.getElementById('home-country')?.focus();
            return;
        }
        router.post(
            URLS.results,
            {
                ...filters,
                country,
                // A different country clears the parish/region chosen for the old one.
                region: country === filters.country ? filters.region : '',
                topic,
            },
            {
                preserveScroll: compact,
                onStart: () => setBusy(true),
                onFinish: () => setBusy(false),
            },
        );
    };

    return (
        <form className={'search-form ' + (compact ? 'compact' : '')} onSubmit={submit} noValidate>
            {!compact && (
                <div className="search-heading">
                    <h2>{t('heading', 'Search for support')}</h2>
                    <p>{t('intro', 'Explore the support available to you, at your own pace.')}</p>
                </div>
            )}
            <div className="search-fields">
                <label htmlFor={compact ? 'results-country' : 'home-country'}>
                    <span>{t('country_label', 'Where will you receive support?')}</span>
                    <SearchSelect
                        id={compact ? 'results-country' : 'home-country'}
                        ariaLabel="Country or territory"
                        icon={<Icon name="pin" />}
                        invalid={!!feedback}
                        value={country}
                        onChange={(v) => {
                            setCountry(v);
                            setFeedback('');
                        }}
                        options={countries.map((c) => c.name)}
                        allLabel={compact ? 'All locations (directory-wide)' : undefined}
                        placeholder={t('country_placeholder', 'Select country or territory')}
                        searchPlaceholder={t('country_search', 'Search countries and territories')}
                    />
                </label>
                <label htmlFor={compact ? 'results-topic' : 'home-topic'}>
                    <span>
                        {t('topic_label', 'What would you like help with?')} <small>{t('optional', 'Optional')}</small>
                    </span>
                    <SearchSelect
                        id={compact ? 'results-topic' : 'home-topic'}
                        value={topic}
                        onChange={setTopic}
                        options={topics.map((t) => t.name)}
                        allLabel={t('topic_all', 'Browse all support options')}
                        searchPlaceholder={t('topic_search', 'Search areas of support')}
                    />
                </label>
                <button className="button search-submit" type="submit" disabled={busy}>
                    <Icon name="search" />
                    {busy ? t('busy', 'Finding support…') : t('button', 'Find support')}
                </button>
            </div>
            {!compact && <p className="search-help">{t('help', 'You do not need to know which type of provider to look for.')}</p>}
            {feedback && (
                <p className="error" role="alert">
                    {feedback}
                </p>
            )}
        </form>
    );
}
