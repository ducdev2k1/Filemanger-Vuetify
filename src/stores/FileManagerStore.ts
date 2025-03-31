import { IRequestDataDto } from '@/interfaces/dto/IRequestDataDto';
import { IFileManager } from '@/interfaces/IFileManager';
import { IFileManagerSharedWith } from '@/interfaces/IFileManagerShare';
import { ITag } from '@/interfaces/ITag';
import FileManagerService from '@/services/user/FileManagerService';
import { EnumShareFilePermission, EnumStatusHttpResponse } from '@/utils/my-enum';
import { getNestedPropValue, tryCallRequest } from '@/utils/my-function';
import { defineStore } from 'pinia';

export const FileManagerStore = defineStore('fileManagerStore', () => {
  const selectedItems = ref([] as IFileManager[]); // object su dung hau het toan bo tinh nang fm
  const objectSelectedOne = ref(emptySelectedOne() as IFileManager); // object nay chi lien quan den context menu, open file
  const listItemDelete = ref([] as IFileManager[]); // object nay chi dung cho ctrl + z
  const listImageInFolder = ref([] as string[]); // object nay dung cho preview image

  function emptySelectedOne() {
    return {
      name: '',
      type: '',
      size: 0,
      path: '',
      owner: {
        account: '',
        permissions: EnumShareFilePermission.unknown,
      } as IFileManagerSharedWith,
      share: [] as IFileManagerSharedWith[],
      tags: [] as ITag[],
      permission: EnumShareFilePermission.unknown,
    } as IFileManager;
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

  async function actionStatFile(item: IFileManager) {
    let responseData;
    // call request
    await tryCallRequest(async () => {
      const request = {
        data: item,
      } as IRequestDataDto;
      const response = await FileManagerService.statFileService(request);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        responseData = response.data.values;
      }
    });
    // return
    return responseData;
  }

  async function actionOpenFile(query: string) {
    let responseData;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.openFileService(query);
      if (getNestedPropValue(response, 'data')) {
        // update data
        responseData = response.data;
      }
    });
    // return
    return responseData;
  }

  async function actionUploadFile(body: IRequestDataDto) {
    // init resposne
    let responseData: { upload_id: string; presignedUrl: { source: string; url: string }[] } = {
      upload_id: '',
      presignedUrl: [],
    };
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.uploadFileService(body);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        responseData = getNestedPropValue(response, 'data.values');
      }
    });
    return responseData;
  }

  async function actionPresignedPutFile(
    presignedPutUrl: string,
    file: File | Blob,
    item?: IFileManager,
    chunk?: {
      item: IFileManager;
      fileStartTime: number;
      index: number;
      totalChunks: number;
      chunksProgress: { loaded: number; lastUploaded: number; lastTime: number }[];
    },
  ) {
    // call request
    const response = await FileManagerService.presignedPutFileService(presignedPutUrl, file, item, chunk);
    if (getNestedPropValue(response, 'status') === 200) {
      // update data
      // return getNestedPropValue(response, 'headers.etag');
      return true;
    }
    return undefined;
  }

  async function actionMergeChunkFile(body: IRequestDataDto) {
    // call request
    const response = await FileManagerService.mergeChunkFileService(body);
    if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
      // update data
      return getNestedPropValue(response, 'data.values');
    }
    return undefined;
  }

  async function actionFastUploadFile(body: IRequestDataDto) {
    // call request - Can xu ly custom service nay nen khong boc trycallrequest
    const response = await FileManagerService.fastUploadFileService(body);
    if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
      // update data
      return getNestedPropValue(response, 'data.values');
    }
    return undefined;
  }

  async function actionPutContentFile(formData: FormData) {
    let hasData;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.putContentFileService(formData);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        hasData = getNestedPropValue(response, 'data.values');
      }
    });
    // return
    return hasData;
  }

  async function actionCreateFile(path: IFileManager) {
    const hasData = {
      message: '',
      success: false,
    };
    const requestDataDto = {
      data: path,
    } as IRequestDataDto;
    // call request
    try {
      const response = await FileManagerService.createFileService(requestDataDto);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        hasData.message = getNestedPropValue(response, 'data.values');
        hasData.success = true;
      }
    } catch (error) {
      hasData.message = getNestedPropValue(error, 'response.data.values');
    }
    // return
    return hasData;
  }

  async function actionCopyFile(path: IFileManager) {
    let hasData;
    const requestDataDto = {
      data: path,
    } as IRequestDataDto;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.copyFileService(requestDataDto);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        hasData = getNestedPropValue(response, 'data.values');
      }
    });
    // return
    return hasData;
  }

  async function actionMoveFile(path: IFileManager) {
    let hasData;
    const requestDataDto = {
      data: path,
    } as IRequestDataDto;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.moveFileService(requestDataDto);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        hasData = getNestedPropValue(response, 'data.values');
      }
    });
    // return
    return hasData;
  }

  async function actionRenameFile(path: IFileManager) {
    let hasData: string = '';
    const requestDataDto = {
      data: path,
    } as IRequestDataDto;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.renameFileService(requestDataDto);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        hasData = getNestedPropValue(response, 'data.values');
      }
    });
    // return
    return hasData;
  }

  async function actionMoveTrashFile(path: IFileManager[]) {
    let hasData = [] as any[];
    const requestDataDto = {
      data: path,
    } as IRequestDataDto;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.moveTrashFileService(requestDataDto);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        hasData = getNestedPropValue(response, 'data.values');
      }
    });
    // return
    return hasData;
  }

  async function actionRestoreTrashFile(path: IFileManager[]) {
    let hasData = [] as any[];
    const requestDataDto = {
      data: path,
    } as IRequestDataDto;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.restoreTrashFileService(requestDataDto);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        hasData = getNestedPropValue(response, 'data.values');
      }
    });
    // return
    return hasData;
  }

  async function actionDeleteFile(path: IFileManager[]) {
    const hasData = [] as any;
    const requestDataDto = {
      data: path,
    } as IRequestDataDto;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.deleteFileService(requestDataDto);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        hasData.push(getNestedPropValue(response, 'data.values'));
      }
    });
    // return
    return hasData;
  }

  async function actionGeneratedDownloadIdMultipleFile(paths: IFileManager[]) {
    let hasData;
    const requestDataDto = {
      data: paths,
    } as IRequestDataDto;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.generatedDownloadIdMultipleFileService(requestDataDto);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        hasData = getNestedPropValue(response, 'data.values');
      }
    });
    // return
    return hasData;
  }

  async function actionSearchFile(body: IRequestDataDto) {
    const responseData = {
      data: [] as IFileManager[],
    } as IRequestDataDto;
    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.searchFileService(body);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        responseData.data = response.data.values;
      }
    });
    // return
    return responseData.data;
  }

  function actionSetListImageInFolder(data: string[]) {
    listImageInFolder.value = data;
  }

  //demo sư kiện duplicate file and folder
  async function actionDuplicateFileAndFolder(listPath: string[]) {
    const responseData = {
      data: [] as IFileManager[],
    } as IRequestDataDto;
    const request = {
      data: listPath,
    } as IRequestDataDto;

    // call request
    await tryCallRequest(async () => {
      const response = await FileManagerService.duplicateFileAndFolderService(request);
      if (getNestedPropValue(response, 'data.status') === EnumStatusHttpResponse.success) {
        // update data
        responseData.data = response.data.values;
      }
    });
    // return
    return responseData.data;
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
    actionOpenFile,
    actionStatFile,
    actionCreateFile,
    actionPresignedPutFile,
    actionUploadFile,
    actionMergeChunkFile,
    actionFastUploadFile,
    actionPutContentFile,
    actionCopyFile,
    actionMoveFile,
    actionRenameFile,
    actionMoveTrashFile,
    actionRestoreTrashFile,
    actionDeleteFile,
    actionGeneratedDownloadIdMultipleFile,
    actionSearchFile,
    actionSetListItemDelete,
    actionSetListImageInFolder,
    actionDuplicateFileAndFolder,
  };
});
