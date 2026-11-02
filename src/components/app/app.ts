import AppController from '../controller/controller';
import { liveApiAvailable, type DataMode } from '../controller/appLoader';
import { AppView } from '../view/appView';
import { mustFind } from '../../utils/dom';

class App {
    private mode: DataMode = 'demo';
    private controller = new AppController(this.mode);
    private readonly view = new AppView();

    start(): void {
        mustFind(document, '.sources').addEventListener('click', (e) =>
            this.controller.getNews(e, (data) => this.view.drawNews(data))
        );

        this.initModeSwitch();
        this.loadMode();
    }

    // re-create the controller for the current data mode and render sources from scratch
    private loadMode(): void {
        this.controller = new AppController(this.mode);

        const sourcesContainer = mustFind(document, '.sources');
        sourcesContainer.removeAttribute('data-source');

        this.view.clear();
        this.controller.getSources((data) => this.view.drawSources(data));
    }

    private initModeSwitch(): void {
        const toggle = mustFind<HTMLInputElement>(document, '#dataModeToggle');
        const dialog = mustFind<HTMLDialogElement>(document, '#liveApiDialog');

        toggle.addEventListener('click', (event: MouseEvent) => {
            const desired: DataMode = toggle.checked ? 'live' : 'demo';

            if (desired === 'live' && !liveApiAvailable()) {
                // revert the switch and explain why the live api is off in this build
                event.preventDefault();
                toggle.checked = false;
                dialog.showModal();
                return;
            }

            if (desired !== this.mode) {
                this.mode = desired;
                this.loadMode();
            }
        });

        mustFind<HTMLButtonElement>(dialog, '.modal__close-btn').addEventListener('click', () => dialog.close());

        // clicking the dimmed backdrop also closes the dialog
        dialog.addEventListener('click', (event: MouseEvent) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    }
}

export default App;
