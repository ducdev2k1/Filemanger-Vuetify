import { App } from 'vue';
// import components
import BtnBase from './components/Button/BtnBase.vue';
import BtnBaseIcon from './components/Button/BtnBaseIcon.vue';
import BtnSwicthView from './components/Button/BtnSwicthView.vue';
import FileManager from './components/FileManager/FileManager.vue';

export default {
  install(app: App) {
    app.component('FileManager', FileManager);
    app.component('BtnSwicthView', BtnSwicthView);
    app.component('BtnBase', BtnBase);
    app.component('BtnBaseIcon', BtnBaseIcon);
  },
};

export { BtnBase, BtnBaseIcon, BtnSwicthView, FileManager };
