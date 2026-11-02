import type { Source } from '../../../models/source';
import { mustFind } from '../../../utils/dom';
import './sources.css';

class Sources {
    draw(sources: Source[]): void {
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

    clear(): void {
        mustFind(document, '.sources').textContent = '';
    }
}

export default Sources;
