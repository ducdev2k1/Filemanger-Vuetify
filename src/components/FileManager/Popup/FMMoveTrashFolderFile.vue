<script setup lang="ts">
  import { fmActionMoveTrashFile } from '@/components/v1/FileManager/partial/ConfigActionFileManager';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { FileManagerStore } from '@/stores/user/file-manager-store';
  import { FileManagerActionStore } from '@/stores/user/file-manager-action-store';
  import { EnumTypeConfirm } from '@/utils/my-enum';

  defineOptions({
    inheritAttrs: false,
  });

  const emits = defineEmits(['actionCallbackSuccess']);
  const fileManagerStore = FileManagerStore();
  const fileManagerActionStore = FileManagerActionStore();
  const selectedItems = computed(() => fileManagerStore.selectedItems as IFileManager[]);
  const btnLoading = ref(false);

  async function onToolbarItemActionMoveTrashFile() {
    // Exit if no data
    if (selectedItems.value.length <= 0) return;

    // loading
    btnLoading.value = true;

    await fmActionMoveTrashFile(selectedItems, emits);

    // close loading
    btnLoading.value = false;
  }
</script>

<template>
  <!-- B: SHOW MODAL CONFIRM MOVE TRASH FILE -->
  <modal-confirm
    v-bind="$attrs"
    :loading="btnLoading"
    :type-modal="EnumTypeConfirm.delete"
    @close="fileManagerActionStore.toggleModalMoveTrashFile()"
    @submit="onToolbarItemActionMoveTrashFile" />
  <!-- B: SHOW MODAL CONFIRM MOVE TRASH FILE -->
</template>

<style scoped></style>
