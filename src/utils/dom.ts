// DOM query helper for strict mode: querySelector returns `Element | null`,
// but page layout guarantees these nodes exist - if they don't, we want a
// clear error instead of a "reading properties of null" TypeError.
export function mustFind<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Required element not found by selector: "${selector}"`);
    }

    return element;
}
