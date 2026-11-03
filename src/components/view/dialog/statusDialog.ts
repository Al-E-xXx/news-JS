import { mustFind } from '../../../utils/dom';
import './statusDialog.css';

const DEFAULT_LOADING_TEXT = 'Loading...';
const DEFAULT_RETRY_TEXT = 'Try again';

export interface NoticeOptions {
    retryLabel?: string;
    onRetry?: () => void;
}

export class StatusDialog {
    private readonly dialog = mustFind<HTMLDialogElement>(document, '#statusDialog');
    private readonly textElement = mustFind<HTMLElement>(document, '#statusDialogText');
    private readonly retryButton = mustFind<HTMLButtonElement>(this.dialog, '[data-action="retry"]');
    private readonly closeButton = mustFind<HTMLButtonElement>(this.dialog, '[data-action="close"]');

    private retryHandler: (() => void) | null = null;

    constructor() {
        this.closeButton.addEventListener('click', () => this.close());
        this.retryButton.addEventListener('click', () => {
            const handler = this.retryHandler;
            this.close();
            handler?.();
        });

        this.dialog.addEventListener('cancel', (event) => {
            if (this.isLoading()) {
                event.preventDefault();
            }
        });
        this.dialog.addEventListener('click', (event) => {
            if (event.target === this.dialog && !this.isLoading()) {
                this.close();
            }
        });
    }

    showLoading(message = DEFAULT_LOADING_TEXT): void {
        this.retryHandler = null;
        this.retryButton.hidden = true;
        this.textElement.textContent = message;
        this.dialog.classList.add('is-loading');
        this.open();
    }

    showNotice(message: string, { retryLabel = DEFAULT_RETRY_TEXT, onRetry }: NoticeOptions = {}): void {
        this.retryHandler = onRetry ?? null;
        this.retryButton.hidden = onRetry === undefined;
        this.retryButton.textContent = retryLabel;
        this.textElement.textContent = message;
        this.dialog.classList.remove('is-loading');
        this.open();
    }

    close(): void {
        this.retryHandler = null;

        if (this.dialog.open) {
            this.dialog.close();
        }
    }

    private open(): void {
        if (!this.dialog.open) {
            this.dialog.showModal();
        }
    }

    private isLoading(): boolean {
        return this.dialog.classList.contains('is-loading');
    }
}

export default StatusDialog;
