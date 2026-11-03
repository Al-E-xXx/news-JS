import Loader from './loader';

export type DataMode = 'demo' | 'live';

class AppLoader extends Loader {
    public readonly mode: DataMode;

    public constructor(mode: DataMode = 'demo') {
        super(AppLoader.baseUrl(mode), AppLoader.query(mode));
        this.mode = mode;
    }

    private static baseUrl(mode: DataMode): string {
        const base = mode === 'live' ? process.env.API_URL : process.env.API_MOCK_URL;

        return base.endsWith('/') ? base : `${base}/`;
    }

    private static query(mode: DataMode): Record<string, string> {
        return mode === 'live' ? { apiKey: process.env.API_KEY } : {};
    }
}

export default AppLoader;
