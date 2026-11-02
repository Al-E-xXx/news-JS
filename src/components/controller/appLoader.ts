import Loader from './loader';

export type DataMode = 'demo' | 'live';

// Static demo data (mocks/) is bundled into every build; the live api is
// enabled at build time only for dev/prod builds (see webpack configs).
export function liveApiAvailable(): boolean {
    return process.env.API_LIVE_AVAILABLE === 'true';
}

class AppLoader extends Loader {
    constructor(mode: DataMode = 'demo') {
        super(AppLoader.baseUrl(mode), AppLoader.query(mode));
    }

    private static baseUrl(mode: DataMode): string {
        const base = mode === 'live' ? process.env.API_URL : process.env.API_MOCK_URL;
        return base.endsWith('/') ? base : `${base}/`;
    }

    private static query(mode: DataMode): Record<string, string> {
        // mock json files ignore query params, no key is sent for them
        return mode === 'live' ? { apiKey: process.env.API_KEY } : {};
    }
}

export default AppLoader;
