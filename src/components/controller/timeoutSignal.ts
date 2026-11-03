export class TimeoutSignal {
    private readonly controller = new AbortController();
    private readonly timer: ReturnType<typeof setTimeout>;
    private expired = false;

    public constructor(timeoutMs: number) {
        this.timer = setTimeout(() => {
            this.expired = true;
            this.controller.abort(new DOMException(`Request timed out after ${timeoutMs} ms`, 'TimeoutError'));
        }, timeoutMs);
    }

    public get signal(): AbortSignal {
        return this.controller.signal;
    }

    public get timedOut(): boolean {
        return this.expired;
    }

    public dispose(): void {
        clearTimeout(this.timer);
    }
}

export default TimeoutSignal;
