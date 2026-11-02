import type { EverythingResponse, SourcesResponse } from '../../models/response';
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
        const values = data.sources ?? [];
        this.sources.draw(values);
    }
}

export default AppView;
