<script setup lang="ts">
  import { dataFilemanager } from '@/data/DataFilemanager';
  import { IContextMenu } from './interfaces/IContextMenu';
  import { IFileManager } from './interfaces/IFileManager';

  const selectedItems = ref<any[]>([]);
  const selectedOneItem = ref<any>();
  const getThumbnailIcon = (item: any) => {
    console.log('item :>> ', item);
  };

  const updateSelection = (data: IFileManager[]) => {
    selectedItems.value = data;
    console.log('selectedItems :>> ', selectedItems.value);
  };
  const updateSelectedOne = (data: IFileManager) => {
    selectedOneItem.value = data;
    console.log('selectedOne :>> ', selectedOneItem.value);
  };

  const handleScroll = (event: MouseEvent) => {
    console.log('handleScroll :>> ', event);
  };

  const clickOptionContextMenu = (option: IContextMenu) => {
    console.log('clickOptionContextMenu :>> ', option);
  };
</script>

<template>
  <div class="h-screen">
    <!-- v-model="selectedItems"
    v-model:selectedOne="selectedOne" -->
    <FileManager
      currentPath=""
      return-object
      fixed-header
      height="100vh"
      item-height="56"
      :theme="'dark'"
      :show-checkbox="false"
      :update-selected="updateSelection"
      :update-selected-one="updateSelectedOne"
      :custom-thumbnail-icon="getThumbnailIcon"
      :dataFilemanger="dataFilemanager"
      :context-menu-click="clickOptionContextMenu(option)"
      @scroll="handleScroll" />
  </div>
</template>
