import AppController from '../controller/controller';
import { type DataMode } from '../controller/appLoader';
import { cachedServerStatus, probeApi, rememberServerStatus } from '../controller/apiAvailability';
import { LoadError } from '../controller/loader';
import { AppView } from '../view/appView';
import { mustFind } from '../../utils/dom';

const SLOW_REQUEST_MS = 600;
const READY_HINT_MS = 4000;

const VPN_HINT =
    'The api server may be sleeping and need a minute to start, or be blocked by your internet provider - ' +
    'in that case a vpn helps.';

const SWITCH_OFF_HINT = 'Live api is only available when the api server is reachable';
const SWITCH_ON_HINT = 'Live api is available';

class App {
    private mode: DataMode = 'demo';
    private controller = new AppController(this.mode);

    private readonly view = new AppView();
    private readonly modeSwitch = mustFind<HTMLElement>(document, '.mode-switch');
    private readonly modeToggle = mustFind<HTMLInputElement>(document, '#dataModeToggle');

    private inFlightProbe: Promise<boolean> | null = null;
    private readyHintTimer: ReturnType<typeof setTimeout> | null = null;

    public start(): void {
        mustFind(document, '.sources').addEventListener('click', (event) => this.onSourceClick(event));

        this.initModeSwitch();
        this.applyStoredServerStatus();
        void this.startup();
    }

    private async startup(): Promise<void> {
        await this.loadSources();
        void this.checkServer(false);
    }

    private applyStoredServerStatus(): void {
        const status = cachedServerStatus();

        this.setServerAvailable(status !== null && status.available);
    }

    private initModeSwitch(): void {
        this.modeToggle.addEventListener('change', () => {
            const desired: DataMode = this.modeToggle.checked ? 'live' : 'demo';

            if (desired !== this.mode) {
                void this.switchMode(desired);
            }
        });

        this.modeSwitch.addEventListener('click', (event) => {
            if (this.modeToggle.disabled) {
                event.preventDefault();
                this.showServerOfflineNotice();
            }
        });
    }

    private onSourceClick(event: MouseEvent): void {
        const button = event.target instanceof Element ? event.target.closest<HTMLElement>('.source__item') : null;

        void this.loadNews(event, button);
    }

    private async switchMode(mode: DataMode): Promise<void> {
        this.mode = mode;
        await this.loadSources();
    }

    private fetchSources(): Promise<void> {
        this.controller = new AppController(this.mode);

        return this.controller.getSources((data) => this.view.drawSources(data));
    }

    private async loadSources(): Promise<void> {
        this.view.clear();

        try {
            await this.runWithLoader(() => this.fetchSources(), 'Loading news sources...');

            if (this.mode === 'live') {
                this.markServerAvailable(true);
            }
        } catch (error) {
            await this.recoverFromSourcesFailure(error);
        }
    }

    private async loadNews(event: MouseEvent, button: HTMLElement | null): Promise<void> {
        try {
            await this.runWithLoader(
                () => this.controller.getNews(event, (data) => this.view.drawNews(data)),
                `Loading news${button ? ` from ${button.textContent?.trim()}` : ''}...`
            );
            this.view.setActiveSource();
        } catch (error) {
            console.error(error);
            this.view.showNotice(`News could not be loaded: ${describeFailure(error)}.`, {
                retryLabel: 'Try again',
                onRetry: () => button?.click(),
            });
        }
    }

    private async recoverFromSourcesFailure(error: unknown): Promise<void> {
        console.error(error);

        if (!(error instanceof LoadError) || error.status === undefined) {
            this.markServerAvailable(false);
        }

        if (this.mode === 'demo') {
            this.view.showNotice(
                'Demo data could not be loaded. Reload the page - if it does not help, the site files are broken.'
            );
            return;
        }

        this.mode = 'demo';
        this.syncModeToggle();

        try {
            await this.runWithLoader(() => this.fetchSources(), 'Loading demo data...');
        } catch (fallbackError) {
            console.error(fallbackError);
            this.view.showNotice(
                'Demo data could not be loaded either. Reload the page - if it does not help, the site files are broken.'
            );
            return;
        }

        this.view.showNotice(
            `Live news api is not available: ${describeFailure(error)}. The app switched to demo data. ${VPN_HINT}`
        );
    }

    private async checkServer(notify: boolean): Promise<void> {
        const probed = await this.probeServer();
        const available = probed || this.mode === 'live';

        this.setServerAvailable(available);

        if (notify) {
            this.view.showNotice(
                available
                    ? 'The api server is reachable again - the live api switch is enabled.'
                    : `The api server is still not reachable. ${VPN_HINT}`
            );

            return;
        }

        if (available) {
            this.showSwitchReadyHint();
        }
    }

    private probeServer(): Promise<boolean> {
        if (this.inFlightProbe !== null) {
            return this.inFlightProbe;
        }

        const probe = probeApi(process.env.API_URL).then((available) => {
            rememberServerStatus(available);

            return available;
        });

        this.inFlightProbe = probe;

        void probe.finally(() => {
            this.inFlightProbe = null;
        });

        return probe;
    }

    private showServerOfflineNotice(): void {
        this.view.showNotice(`The live api is switched off because the api server cannot be reached. ${VPN_HINT}`, {
            retryLabel: 'Check the server again',
            onRetry: () => void this.checkServer(true),
        });
    }

    private async runWithLoader(request: () => Promise<void>, message: string): Promise<void> {
        const spinnerTimer = setTimeout(() => this.view.showLoading(message), SLOW_REQUEST_MS);

        try {
            await request();
        } finally {
            clearTimeout(spinnerTimer);
            this.view.hideStatus();
        }
    }

    private markServerAvailable(available: boolean): void {
        rememberServerStatus(available);
        this.setServerAvailable(available);
    }

    private setServerAvailable(available: boolean): void {
        this.modeToggle.disabled = !available;
        this.modeSwitch.classList.toggle('is-disabled', !available);
        this.modeSwitch.classList.remove('is-ready');
        this.modeSwitch.title = available ? SWITCH_ON_HINT : SWITCH_OFF_HINT;
    }

    private showSwitchReadyHint(): void {
        if (this.readyHintTimer !== null) {
            clearTimeout(this.readyHintTimer);
        }

        this.modeSwitch.classList.add('is-ready');
        this.readyHintTimer = setTimeout(() => {
            this.modeSwitch.classList.remove('is-ready');
            this.readyHintTimer = null;
        }, READY_HINT_MS);
    }

    private syncModeToggle(): void {
        this.modeToggle.checked = this.mode === 'live';
    }
}

function describeFailure(error: unknown): string {
    if (error instanceof LoadError) {
        return error.code ? `${error.message} (${error.code})` : error.message;
    }

    return error instanceof Error ? error.message : 'unexpected error';
}

export default App;
