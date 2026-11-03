export class TimeoutSignal {
    private readonly controller = new AbortController();
    private readonly timer: ReturnType<typeof setTimeout>;
    private expired = false;

    constructor(timeoutMs: number) {
        this.timer = setTimeout(() => {
            this.expired = true;
            this.controller.abort(new DOMException(`Request timed out after ${timeoutMs} ms`, 'TimeoutError'));
        }, timeoutMs);
    }

    get signal(): AbortSignal {
        return this.controller.signal;
    }

    get timedOut(): boolean {
        return this.expired;
    }

    dispose(): void {
        clearTimeout(this.timer);
    }
}

export default TimeoutSignal;
