// import { EnumActionFileManager } from '@/utils/my-enum';
import { defineStore } from 'pinia';

export const FileManagerActionStore = defineStore('FileManagerActionStore', () => {
  const showContextMenu = ref(false);
  const showModalShare = ref(false);
  const showModalError = ref(false);
  const showModalPreview = ref(false);
  const showModalRenameFile = ref(false);
  const showModalMoveTrashFile = ref(false);
  const showModalConfirmRemoveShareWithMe = ref(false);
  const showModalDeleteTrashFile = ref(false);
  const showModalCopyFile = ref(false);
  const showModalMoveFile = ref(false);
  const positionContextMenu = ref();
  const isLoadingPutContentFile = ref(false);
  const showModalConfirmCloseBeforeSave = ref(false);
  const resetRequestFileManager = ref(0);

  const toggleContextMenu = (position?: any) => {
    showContextMenu.value = !showContextMenu.value;
    positionContextMenu.value = position;
  };

  const openContextMenu = (position?: any) => {
    showContextMenu.value = true;
    positionContextMenu.value = position;
  };

  const closeContextMenu = () => {
    showContextMenu.value = false;
  };

  const toggleModalError = () => {
    showModalError.value = !showModalError.value;
  };

  const toggleModalPreview = () => {
    showModalPreview.value = !showModalPreview.value;
  };

  const toggleModalRenameFile = () => {
    showModalRenameFile.value = !showModalRenameFile.value;
  };

  const toggleModalMoveTrashFile = () => {
    showModalMoveTrashFile.value = !showModalMoveTrashFile.value;
  };

  const toggleModalConfirmRemoveShareWithMe = () => {
    showModalConfirmRemoveShareWithMe.value = !showModalConfirmRemoveShareWithMe.value;
  };

  const toggleModalDeleteTrashFile = () => {
    showModalDeleteTrashFile.value = !showModalDeleteTrashFile.value;
  };

  const toggleModalCopyFile = () => {
    showModalCopyFile.value = !showModalCopyFile.value;
  };

  const toggleModalMoveFile = () => {
    showModalMoveFile.value = !showModalMoveFile.value;
  };

  const loadingPutContentFile = (isLoading: boolean) => {
    isLoadingPutContentFile.value = isLoading;
  };

  const toggleModalConfirmCloseBeforeSave = () => {
    showModalConfirmCloseBeforeSave.value = !showModalConfirmCloseBeforeSave.value;
  };

  const setResetRequestFileManager = () => {
    resetRequestFileManager.value = new Date().getTime();
  };

  return {
    showContextMenu,
    showModalShare,
    showModalError,
    showModalPreview,
    showModalRenameFile,
    showModalMoveTrashFile,
    showModalConfirmRemoveShareWithMe,
    showModalDeleteTrashFile,
    showModalCopyFile,
    showModalMoveFile,
    positionContextMenu,
    isLoadingPutContentFile,
    showModalConfirmCloseBeforeSave,
    resetRequestFileManager,
    toggleContextMenu,
    toggleModalError,
    toggleModalPreview,
    toggleModalRenameFile,
    toggleModalMoveTrashFile,
    toggleModalConfirmRemoveShareWithMe,
    toggleModalDeleteTrashFile,
    toggleModalCopyFile,
    toggleModalMoveFile,
    openContextMenu,
    closeContextMenu,
    loadingPutContentFile,
    toggleModalConfirmCloseBeforeSave,
    setResetRequestFileManager,
  };
});
