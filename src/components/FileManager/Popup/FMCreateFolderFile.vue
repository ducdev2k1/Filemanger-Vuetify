<script setup lang="ts">
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { FileManagerStore } from '@/stores/FileManagerStore';

  const props = defineProps({
    currentPath: {
      type: String,
      default: '',
    },
  });
  const showModalCreateFolder = defineModel('showModalCreateFolder', { default: false });
  const showModalCreateFile = defineModel('showModalCreateFile', { default: false });
  const typeFileCreate = defineModel('typeFileCreate', { default: '' });
  const currentPath = computed(() => props.currentPath || '');
  const fileManagerStore = FileManagerStore();
  const newPath = ref('');
  const btnLoading = ref(false);
  const showModalExistedPathCreate = ref(false);

  async function onToolbarItemActionCreateNewFile(data: string, override?: boolean) {
    // Exit if no data (filename or path) is provided
    if (!data) return;

    // loading
    btnLoading.value = true;

    // Update the path with the provided data
    newPath.value = data;

    // Construct the request object for file creation
    const request = {
      path: newPath.value,
      force_action: override,
    } as IFileManager;

    // Call the file creation action in the file manager store
    const result = await fileManagerStore.actionCreateFile(request);

    // Check if the file already exists and show a modal if true
    if (result && result.message === 'backend_object_existed') {
      showModalExistedPathCreate.value = true;
    } else if (result && result.success) {
      // close modal
      showModalExistedPathCreate.value = false;
      showModalCreateFile.value = false;
      showModalCreateFolder.value = false;
      // reload data
      uploadFileStore.actionForceRefreshFileManager();
    }

    // close loading
    btnLoading.value = false;
  }
</script>

<template>
  <!-- B: SHOW MODAL CREATE FOLDER -->
  <modal-create-file-or-folder
    v-if="showModalCreateFolder"
    :model-value="showModalCreateFolder"
    :type-create="EnumLayoutType.folder"
    :current-path="currentPath"
    :loading="btnLoading"
    @close="showModalCreateFolder = false"
    @action-callback="(data) => onToolbarItemActionCreateNewFile(data)" />
  <!-- E: SHOW MODAL CREATE FOLDER -->
  <!-- B: SHOW MODAL CREATE FILE -->
  <modal-create-file-or-folder
    v-if="showModalCreateFile"
    :model-value="showModalCreateFile"
    :type-create="EnumLayoutType.files"
    :extension="typeFileCreate"
    :current-path="currentPath"
    :loading="btnLoading"
    @close="showModalCreateFile = false"
    @action-callback="(data) => onToolbarItemActionCreateNewFile(data)" />
  <!-- E: SHOW MODAL CREATE FILE -->
  <!-- B: SHOW MODAL CONFIRM CREATE FILE -->
  <modal-confirm
    v-if="showModalExistedPathCreate"
    v-model="showModalExistedPathCreate"
    :loading="btnLoading"
    :type-modal="EnumTypeConfirm.confirm"
    :description="t('locale.data_are_you_sure_override_by_name', { data: newPath })"
    @close="showModalExistedPathCreate = false"
    @submit="onToolbarItemActionCreateNewFile(newPath, true)" />
  <!-- E: SHOW MODAL CONFIRM CREATE FILE -->
</template>

<style scoped></style>
