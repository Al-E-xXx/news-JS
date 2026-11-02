import type { EverythingResponse, SourcesResponse } from '../../models/response';
import { curateSources } from '../../utils/sources';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
    private readonly news = new News();
    private readonly sources = new Sources();

    drawNews(data: EverythingResponse): void {
        const values = data.articles ?? [];
        this.news.draw(values);
    }

    drawSources(data: SourcesResponse): void {
        const values = curateSources(data.sources ?? []);
        this.sources.draw(values);
    }

    clear(): void {
        this.news.clear();
        this.sources.clear();
    }
}

export default AppView;
