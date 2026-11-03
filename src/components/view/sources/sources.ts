import type { Source } from '../../../models/source';
import { mustFind } from '../../../utils/dom';
import './sources.css';

class Sources {
    public draw(sources: Pick<Source, 'id' | 'name'>[]): void {
        const fragment = document.createDocumentFragment();
        const sourceItemTemp = mustFind<HTMLTemplateElement>(document, '#sourceItemTemp');

        sources.forEach((item) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true) as DocumentFragment;

            mustFind(sourceClone, '.source__item-name').textContent = item.name;
            mustFind(sourceClone, '.source__item').setAttribute('data-source-id', item.id);

            fragment.append(sourceClone);
        });

        mustFind(document, '.sources').append(fragment);
    }

    public setActive(): void {
        const container = mustFind(document, '.sources');
        const activeId = container.getAttribute('data-source');

        container.querySelectorAll('.source__item').forEach((item) => {
            item.classList.toggle('is-active', item.getAttribute('data-source-id') === activeId);
        });
    }

    public clear(): void {
        const container = mustFind(document, '.sources');

        container.textContent = '';
        container.removeAttribute('data-source');
    }
}

export default Sources;
