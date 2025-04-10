import { App } from 'vue';

// import styles
import './assets/scss/filemanager.scss';

// Import Components
import BtnBase from './components/Button/BtnBase.vue';
import BtnBaseIcon from './components/Button/BtnBaseIcon.vue';
import BtnSwicthView from './components/Button/BtnSwicthView.vue';
import FileManager from './components/FileManager/FileManager.vue';

export default {
  install(app: App) {
    app.component('BtnBase', BtnBase);
    app.component('BtnBaseIcon', BtnBaseIcon);
    app.component('BtnSwicthView', BtnSwicthView);
    app.component('FileManager', FileManager);
  },
};

export { BtnBase, BtnBaseIcon, BtnSwicthView, FileManager };
