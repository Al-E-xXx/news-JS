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

    drawNews(data: EverythingResponse): void {
        const values = data.articles ?? [];
        this.news.draw(values);
    }

    drawSources(data: SourcesResponse): void {
        const values = curateSources(data.sources ?? []);
        this.sources.draw(values);
    }

    setActiveSource(): void {
        this.sources.setActive();
    }

    clear(): void {
        this.news.clear();
        this.sources.clear();
    }

    showLoading(message?: string): void {
        this.status.showLoading(message);
    }

    showNotice(message: string, options?: NoticeOptions): void {
        this.status.showNotice(message, options);
    }

    hideStatus(): void {
        this.status.close();
    }
}

export default AppView;
