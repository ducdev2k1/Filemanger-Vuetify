import { App } from 'vue';
import Filemanager from './components/FileManager/FileManager.vue';

export default {
  install(app: App) {
    app.component('Filemanager', Filemanager);
  },
};

export { Filemanager };
