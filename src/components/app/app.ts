import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { mustFind } from '../../utils/dom';

class App {
    private readonly controller = new AppController();
    private readonly view = new AppView();

    start(): void {
        mustFind(document, '.sources').addEventListener('click', (e) =>
            this.controller.getNews(e, (data) => this.view.drawNews(data))
        );

        this.controller.getSources((data) => this.view.drawSources(data));
    }
}

export default App;
