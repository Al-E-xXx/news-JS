import type { Source } from '../models/source';

export const PREFERRED_SOURCE_IDS: readonly string[] = [
    'al-jazeera-english',
    'associated-press',
    'bbc-news',
    'business-insider',
    'cbs-news',
    'cnn',
    'fortune',
    'fox-news',
    'nbc-news',
    'the-verge',
    'time',
    'usa-today',
];

export const MAX_SOURCES = 12;

export function curateSources(sources: Source[]): Source[] {
    const preferred = new Set(PREFERRED_SOURCE_IDS);
    const picked = sources.filter((source) => preferred.has(source.id));

    return (picked.length > 0 ? picked : sources).slice(0, MAX_SOURCES);
}
