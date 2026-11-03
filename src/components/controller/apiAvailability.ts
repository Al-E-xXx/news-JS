import TimeoutSignal from './timeoutSignal';

const PROBE_ENDPOINT = 'mocks/sources';
const PROBE_TIMEOUT_MS = 30_000;

const STATUS_STORAGE_KEY = 'news-api.server-status';
const STATUS_TTL_MS = 5 * 60 * 1000;

export interface ServerStatus {
    available: boolean;
    checkedAt: number;
}

export async function probeApi(baseUrl: string, timeoutMs = PROBE_TIMEOUT_MS): Promise<boolean> {
    const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const timeout = new TimeoutSignal(timeoutMs);

    try {
        const response = await fetch(`${base}${PROBE_ENDPOINT}`, { signal: timeout.signal });
        return response.ok;
    } catch (error) {
        console.error('Api probe failed', error);
        return false;
    } finally {
        timeout.dispose();
    }
}

function isServerStatus(value: unknown): value is ServerStatus {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    const status: ServerStatus = value as ServerStatus;

    return typeof status.available === 'boolean' && typeof status.checkedAt === 'number';
}

export function cachedServerStatus(now: number = Date.now()): ServerStatus | null {
    try {
        const stored = localStorage.getItem(STATUS_STORAGE_KEY);

        if (stored === null) {
            return null;
        }

        const status: unknown = JSON.parse(stored);

        if (!isServerStatus(status) || now - status.checkedAt > STATUS_TTL_MS) {
            return null;
        }

        return status;
    } catch {
        return null;
    }
}

export function rememberServerStatus(available: boolean, now: number = Date.now()): void {
    try {
        const status: ServerStatus = { available, checkedAt: now };
        localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(status));
    } catch {
        return;
    }
}
