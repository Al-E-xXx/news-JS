export function mustFind<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
    const element = root.querySelector<T>(selector);

    if (!element) {
        throw new Error(`Required element not found by selector: "${selector}"`);
    }

    return element;
}
