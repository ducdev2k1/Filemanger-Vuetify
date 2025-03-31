<script setup lang="ts">
  import { fileManagerGenerateNewPath } from '@/components/v1/FileManager/partial/HelperFunctionFileManager';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { FileManagerStore } from '@/stores/user/file-manager-store';
  import { EnumTypeConfirm } from '@/utils/my-enum';
  import { showToastMessage } from '@/utils/my-function';

  defineOptions({
    inheritAttrs: false,
  });

  const emits = defineEmits(['actionCallbackSuccess', 'close']);
  const fileManagerStore = FileManagerStore();
  const selectedItems = computed(() => fileManagerStore.selectedItems as IFileManager[]);
  const objectSelectedOne = computed(() => {
    if (selectedItems.value.length === 1) {
      return selectedItems.value[0];
    }
    return fileManagerStore.emptySelectedOne();
  });
  const newPath = ref('');
  const btnLoading = ref(false);
  const showModalExistedPathRename = ref(false);

  async function onToolbarItemActionRenameFile(data: string, override?: boolean) {
    // Exit if no data (new name) is provided
    if (!data) return;

    // loading
    btnLoading.value = true;

    // Update the path with the provided new name
    newPath.value = data;

    // Generate the new path for renaming based on the old path and new name
    const procesedPath = fileManagerGenerateNewPath(
      objectSelectedOne.value.isDirectory,
      objectSelectedOne.value.name,
      objectSelectedOne.value.path,
      data,
    );

    // Construct the request object for renaming the file
    const request = {
      share_id: objectSelectedOne.value.share_id,
      path: procesedPath,
      old_path: objectSelectedOne.value.path,
      force_action: override,
      size: objectSelectedOne.value.size,
      meta_uuid: objectSelectedOne.value.meta_uuid,
      lastModified: objectSelectedOne.value.lastModified,
    } as IFileManager;

    // Call the file renaming action in the file manager store
    const result = await fileManagerStore.actionRenameFile(request);
    // Check if the new name already exists and show a modal if true
    if (result === 'backend_object_existed') {
      showModalExistedPathRename.value = true;
      showToastMessage(t(`locale.${result}`), true);
    } else if (result === 'backend_saved_success') {
      emits('actionCallbackSuccess');
      // close modal
      emits('close');
      showModalExistedPathRename.value = false;
      showToastMessage(t(`locale.${result}`));
      // Update the name and path of the selected file
      objectSelectedOne.value.name = newPath.value;
      objectSelectedOne.value.path = procesedPath;
    }

    // close loading
    btnLoading.value = false;
  }
</script>

<template>
  <!-- B: SHOW MODAL RENAME FILE -->
  <modal-rename
    v-bind="$attrs"
    :loading="btnLoading"
    @close="emits('close')"
    @submit="(data) => onToolbarItemActionRenameFile(data)" />
  <!-- E: SHOW MODAL RENAME FILE -->

  <!-- B: SHOW MODAL CONFIRM RENAME FILE -->
  <modal-confirm
    v-if="showModalExistedPathRename"
    v-model="showModalExistedPathRename"
    :loading="btnLoading"
    :type-modal="EnumTypeConfirm.confirm"
    :description="t('locale.data_are_you_sure_override_by_name', { data: newPath })"
    @close="showModalExistedPathRename = false"
    @submit="onToolbarItemActionRenameFile(newPath, true)" />
  <!-- E: SHOW MODAL CONFIRM RENAME FILE -->
</template>

<style scoped></style>
