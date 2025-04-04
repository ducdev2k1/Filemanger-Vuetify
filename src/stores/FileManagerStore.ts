import { IFileManager } from '@/interfaces/IFileManager';
import { defineStore } from 'pinia';

export const FileManagerStore = defineStore('FileManagerStore', () => {
  const selectedItems = ref([] as IFileManager[]); // object su dung hau het toan bo tinh nang fm
  const objectSelectedOne = ref({} as IFileManager); // object nay chi lien quan den context menu, open file
  const listItemDelete = ref([] as IFileManager[]); // object nay chi dung cho ctrl + z
  const listImageInFolder = ref([] as string[]); // object nay dung cho preview image

  function emptySelectedOne() {
    return {
      name: '',
      type: '',
      size: 0,
      path: '',
    } as unknown as IFileManager;
  }

  function actionSetEmptyObjectSelectedOne() {
    objectSelectedOne.value = emptySelectedOne();
  }

  function actionSetSelectedItems(data: IFileManager[]) {
    selectedItems.value = data;
  }

  function actionSetObjectSelectedOne(data: IFileManager) {
    objectSelectedOne.value = data;
  }

  function actionSetListItemDelete(data: IFileManager[]) {
    listItemDelete.value = data;
  }

  function actionSetListImageInFolder(data: string[]) {
    listImageInFolder.value = data;
  }

  return {
    selectedItems,
    objectSelectedOne,
    listItemDelete,
    listImageInFolder,
    emptySelectedOne,
    actionSetEmptyObjectSelectedOne,
    actionSetSelectedItems,
    actionSetObjectSelectedOne,

    actionSetListItemDelete,
    actionSetListImageInFolder,
  };
});
