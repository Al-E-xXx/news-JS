import type { Article } from '../../../models/article';
import { mustFind } from '../../../utils/dom';
import './news.css';

class News {
    public draw(articles: Article[]): void {
        const news = articles.length >= 10 ? articles.filter((_item, idx) => idx < 10) : articles;

        const newsContainer = mustFind(document, '.news');
        newsContainer.innerHTML = '';

        if (news.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'news__empty';
            empty.textContent = 'No news available for this source';
            newsContainer.append(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        const newsItemTemp = mustFind<HTMLTemplateElement>(document, '#newsItemTemp');

        news.forEach((item) => {
            const newsClone = newsItemTemp.content.cloneNode(true) as DocumentFragment;

            const photo = mustFind(newsClone, '.news__meta-photo');

            if (item.urlToImage) {
                photo.style.backgroundImage = `url("${item.urlToImage.replace(/"/g, '%22')}")`;
            } else {
                photo.classList.add('is-missing');
            }
            mustFind(newsClone, '.news__meta-author').textContent = item.author || item.source.name;
            mustFind(newsClone, '.news__meta-date').textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');

            mustFind(newsClone, '.news__description-title').textContent = item.title;
            mustFind(newsClone, '.news__description-source').textContent = item.source.name;
            mustFind(newsClone, '.news__description-content').textContent = item.description;
            mustFind(newsClone, '.news__read-more a').setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        newsContainer.appendChild(fragment);
    }

    public clear(): void {
        mustFind(document, '.news').textContent = '';
    }
}

export default News;
