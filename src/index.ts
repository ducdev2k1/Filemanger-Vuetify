import { App } from 'vue';
// import components
import BtnSwicthView from './components/Button/BtnSwicthView.vue';
import FileManager from './components/FileManager/FileManager.vue';

export default {
  install(app: App) {
    app.component('FileManager', FileManager);
    app.component('BtnSwicthView', BtnSwicthView);
  },
};

export { BtnSwicthView, FileManager };
