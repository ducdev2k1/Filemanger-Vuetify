<script setup lang="ts">
  import { dataFilemanager } from '@/data/DataFilemanager';

  const selectedItems = ref<any[]>([]);
  const getThumbnailIcon = (item: any) => {
    console.log('item :>> ', item);
  };
</script>

<template>
  <div class="h-screen">
    <FileManager
      :theme="'dark'"
      currentPath=""
      v-model="selectedItems"
      return-object
      fixed-header
      height="100vh"
      item-height="56"
      :custom-thumbnail-icon="getThumbnailIcon"
      :dataFilemanger="dataFilemanager"
      :showCheckbox="false" />
  </div>
</template>
