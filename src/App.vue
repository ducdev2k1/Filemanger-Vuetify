<script setup lang="ts">
  import { dataFilemanager } from '@/Data/DataFilemanager';
  import { IContextMenu } from './interfaces/IContextMenu';

  const selectedItems = ref<any[]>([]);
  const selectedOneItem = ref<any>();

  const loading = ref(false);

  const getThumbnailIcon = (item: any) => {
    console.log('item :>> ', item);
  };

  const handleScroll = () => {
    console.log('handleScroll :>> ');
  };

  const clickOptionContextMenu = (option: IContextMenu) => {
    console.log('clickOptionContextMenu :>> ', option);
  };

  const handleRẹefresh = () => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 2000);
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
      item-height="46"
      :loading="loading"
      :data-filemanger="dataFilemanager"
      :theme="'dark'"
      :show-checkbox="false"
      :update-selected="(data) => (selectedItems = data)"
      :update-selected-one="(data) => (selectedOneItem = data)"
      :custom-thumbnail-icon="getThumbnailIcon"
      :context-menu-click="clickOptionContextMenu"
      @scroll="handleScroll"
      @refresh="handleRẹefresh" />
  </div>
</template>
