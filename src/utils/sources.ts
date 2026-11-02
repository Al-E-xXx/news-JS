import type { Source } from '../models/source';

// A curated shortlist of popular english-language sources: it keeps the
// sources row readable and is compatible with both the live api and mocks.
export const PREFERRED_SOURCE_IDS: readonly string[] = [
    'abc-news',
    'associated-press',
    'business-insider',
    'cbs-news',
    'cnn',
    'cnbc',
    'espn',
    'fortune',
    'fox-news',
    'nbc-news',
    'the-verge',
    'usa-today',
];

export const MAX_SOURCES = 12;

export function curateSources(sources: Source[]): Source[] {
    const preferred = new Set(PREFERRED_SOURCE_IDS);
    const picked = sources.filter((source) => preferred.has(source.id));

    // fallback for unexpected locales: just take the first ones
    return (picked.length > 0 ? picked : sources).slice(0, MAX_SOURCES);
}
