import { App } from 'vue';
import BtnSwicthView from './components/Button/BtnSwicthView.vue';
import Filemanager from './components/FileManager/FileManager.vue';

export default {
  install(app: App) {
    app.component('Filemanager', Filemanager);
    app.component('BtnSwicthView', BtnSwicthView);
  },
};

export { Filemanager };
