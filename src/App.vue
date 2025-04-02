<script setup lang="ts">
  import { dataFilemanager } from '@/data/DataFilemanager';

  const selectedItems = ref<any[]>([]);

  const getThumbnailIcon = (item: any) => {
    console.log('getThumbnailIcon :>> ', item);
  };

  watch(selectedItems, () => {
    console.log('watch selectedItems :>> ', selectedItems.value);
  });
</script>

<template>
  <div>
    <FileManager
      currentPath=""
      v-model="selectedItems"
      return-object
      fixed-header
      item-height="56"
      :custom-thumbnail-icon="getThumbnailIcon"
      :dataFilemanger="dataFilemanager"
      :showCheckbox="true" />
  </div>
</template>
