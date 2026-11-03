import type { EverythingResponse, SourcesResponse } from '../../models/response';
import { curateSources } from '../../utils/sources';
import { type NoticeOptions } from './dialog/statusDialog';
import StatusDialog from './dialog/statusDialog';
import News from './news/news';
import Sources from './sources/sources';

export class AppView {
    private readonly news = new News();
    private readonly sources = new Sources();
    private readonly status = new StatusDialog();

    public drawNews(data: EverythingResponse): void {
        const values = data.articles ?? [];
        this.news.draw(values);
    }

    public drawSources(data: SourcesResponse): void {
        const values = curateSources(data.sources ?? []);
        this.sources.draw(values);
    }

    public setActiveSource(): void {
        this.sources.setActive();
    }

    public clear(): void {
        this.news.clear();
        this.sources.clear();
    }

    public showLoading(message?: string): void {
        this.status.showLoading(message);
    }

    public showNotice(message: string, options?: Partial<NoticeOptions>): void {
        this.status.showNotice(message, options);
    }

    public hideStatus(): void {
        this.status.close();
    }
}

export default AppView;
