import type { Article } from '../../../models/article';
import { mustFind } from '../../../utils/dom';
import './news.css';

class News {
    draw(articles: Article[]): void {
        const news = articles.length >= 10 ? articles.filter((_item, idx) => idx < 10) : articles;

        const fragment = document.createDocumentFragment();
        const newsItemTemp = mustFind<HTMLTemplateElement>(document, '#newsItemTemp');

        news.forEach((item, idx) => {
            const newsClone = newsItemTemp.content.cloneNode(true) as DocumentFragment;

            if (idx % 2) mustFind(newsClone, '.news__item').classList.add('alt');

            mustFind(newsClone, '.news__meta-photo').style.backgroundImage = `url(${
                item.urlToImage || 'img/news_placeholder.jpg'
            })`;
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

        const newsContainer = mustFind(document, '.news');
        newsContainer.innerHTML = '';
        newsContainer.appendChild(fragment);
    }

    clear(): void {
        mustFind(document, '.news').textContent = '';
    }
}

export default News;
