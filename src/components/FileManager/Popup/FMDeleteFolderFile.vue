<script setup lang="ts">
  import { IFileManager } from '@/interfaces/IFileManager';
  import { FileManagerStore } from '@/stores/user/file-manager-store';
  import { EnumTypeConfirm } from '@/utils/my-enum';
  import { FileManagerActionStore } from '@/stores/user/file-manager-action-store';

  defineOptions({
    inheritAttrs: false,
  });

  const emits = defineEmits(['actionCallbackSuccess']);
  const fileManagerStore = FileManagerStore();
  const fileManagerActionStore = FileManagerActionStore();
  const selectedItems = computed(() => fileManagerStore.selectedItems as IFileManager[]);
  const btnLoading = ref(false);

  async function onToolbarItemActionDeleteTrashFile() {
    // Exit if no data
    if (selectedItems.value.length <= 0) return;

    // loading
    btnLoading.value = true;

    // Construct the request object for renaming the file
    const request = selectedItems.value.map((item) => {
      return {
        path: item.path,
      };
    }) as IFileManager[];

    // Call the file renaming action in the file manager store
    const result = await fileManagerStore.actionDeleteFile(request);
    if (result && result.length > 0) {
      emits('actionCallbackSuccess');
      // close modal
      fileManagerActionStore.toggleModalDeleteTrashFile();
    }

    // close loading
    btnLoading.value = false;
  }
</script>

<template>
  <!-- B: SHOW MODAL CONFIRM DELETE TRASH FILE -->
  <modal-confirm
    v-bind="$attrs"
    :loading="btnLoading"
    :type-modal="EnumTypeConfirm.delete"
    :permanently="true"
    @close="fileManagerActionStore.toggleModalDeleteTrashFile()"
    @submit="onToolbarItemActionDeleteTrashFile" />
  <!-- B: SHOW MODAL CONFIRM DELETE TRASH FILE -->
</template>

<style scoped></style>
