import type { EverythingResponse, SourcesResponse } from '../../models/response';
import type { ResponseCallback } from './loader';
import AppLoader, { type DataMode } from './appLoader';

class AppController extends AppLoader {
    constructor(mode: DataMode = 'demo') {
        super(mode);
    }

    getSources(callback: ResponseCallback<SourcesResponse>): void {
        super.getResp(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    getNews(e: MouseEvent, callback: ResponseCallback<EverythingResponse>): void {
        const newsContainer = e.currentTarget;

        if (!(newsContainer instanceof Element)) {
            return;
        }

        let target: Node | null = e.target instanceof Node ? e.target : null;

        while (target && target !== newsContainer) {
            if (target instanceof Element && target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');

                if (sourceId !== null && newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }
            target = target.parentNode;
        }
    }
}

export default AppController;
