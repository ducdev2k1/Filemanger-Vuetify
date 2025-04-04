<script setup lang="ts">
  import { dataFilemanager } from '@/data/DataFilemanager';

  const selectedItems = ref<any[]>([]);
  const selectedOne = ref<any>();
  const getThumbnailIcon = (item: any) => {
    console.log('item :>> ', item);
  };

  const updateSelection = (data: any[]) => {
    selectedItems.value = data;
    console.log('selectedItems :>> ', selectedItems.value);
  };
  const handleScroll = () => {
    console.log('handleScroll :>> ');
  };

  const clickOptionContextMenu = (option: any) => {
    console.log('data :>> ', option);
  };
</script>

<template>
  <div class="h-screen">
    <FileManager
      :theme="'dark'"
      currentPath=""
      v-model="selectedItems"
      v-model:selectedOne="selectedOne"
      return-object
      fixed-header
      height="100vh"
      item-height="56"
      :update-selectedItems="updateSelection"
      :custom-thumbnail-icon="getThumbnailIcon"
      :dataFilemanger="dataFilemanager"
      @scroll="handleScroll"
      @click-option-context-menu="(option: any) => clickOptionContextMenu(option)"
      :showCheckbox="false"></FileManager>
  </div>
</template>
