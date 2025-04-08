<script setup lang="ts">
  import { demoDataFilemanager } from '@/Data/DemoDataFilemanager';
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

  const handleRefresh = () => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 2000);
  };

  const handleClickRow = (item: any) => {
    // console.log('handleClickRow :>> ', item);
  };

  const handleDoubleClickRow = (item: any) => {
    console.log('handleDoubleClickRow :>> ', item);
  };

  const handleClickContextMenu = (option: IContextMenu) => {
    console.log('handleClickContextMenu :>> ', option);
  };
  const handleClickItem = (item: any) => {
    console.log('handleClickItem :>> ', item);
  };

  // debug selectedItems and selectedOneItem
  watch(
    () => selectedItems.value,
    (newVal) => {
      console.log(' debug selectedItems :>> ', newVal);
    },
  );

  watch(
    () => selectedOneItem.value,
    (newVal) => {
      console.log(' debug selectedOneItem :>> ', newVal);
    },
  );
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
      :data-filemanger="demoDataFilemanager"
      :theme="'dark'"
      :show-checkbox="false"
      :update-selected="(data) => (selectedItems = data)"
      :update-selected-one="(data) => (selectedOneItem = data)"
      :custom-thumbnail-icon="getThumbnailIcon"
      :context-menu-click="clickOptionContextMenu"
      :on-click-row="handleClickRow"
      :double-click-row="handleDoubleClickRow"
      @scroll="handleScroll"
      @refresh="handleRefresh" />
  </div>
</template>
