import type { EverythingResponse, SourcesResponse } from '../../models/response';
import type { ResponseCallback } from './loader';
import AppLoader, { type DataMode } from './appLoader';

class AppController extends AppLoader {
    constructor(mode: DataMode = 'demo') {
        super(mode);
    }

    getSources(callback: ResponseCallback<SourcesResponse>): Promise<void> {
        return super.getResp(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    getNews(e: MouseEvent, callback: ResponseCallback<EverythingResponse>): Promise<void> {
        const newsContainer = e.currentTarget;

        if (!(newsContainer instanceof Element)) {
            return Promise.resolve();
        }

        let target: Node | null = e.target instanceof Node ? e.target : null;

        while (target && target !== newsContainer) {
            if (target instanceof Element && target.classList.contains('source__item')) {
                const sourceId = target.getAttribute('data-source-id');

                if (sourceId !== null) {
                    newsContainer.setAttribute('data-source', sourceId);
                    return super.getResp(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId,
                                pageSize: 20,
                            },
                        },
                        this.newsOfSource(sourceId, callback)
                    );
                }

                return Promise.resolve();
            }

            target = target.parentNode;
        }

        console.log('Selected sources not detected');
        return Promise.resolve();
    }

    private newsOfSource(
        sourceId: string,
        callback: ResponseCallback<EverythingResponse>
    ): ResponseCallback<EverythingResponse> {
        if (this.mode !== 'demo') {
            return callback;
        }

        return (data) =>
            callback({
                ...data,
                articles: (data.articles ?? []).filter((article) => article.source.id === sourceId),
            });
    }
}

export default AppController;
