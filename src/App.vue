<script setup lang="ts">
  import { IContextMenu } from './interfaces/IContextMenu';
  import { IFileManager } from './interfaces/IFileManager';

  const selectedItems = ref<any[]>([]);
  const selectedOneItem = ref<any>();
  const listBreadcrumb = ref<IFileManager[]>([]);

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

  const handleDoubleClickRow = (item: IFileManager) => {
    if (item.isDirectory) {
      listBreadcrumb.value.push(item);
      console.log('listBreadcrumb.value :>> ', listBreadcrumb.value);
    } else {
      console.log('handleDoubleClickRow :>> ', item);
    }
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
    <FileManager
      currentPath=""
      return-object
      fixed-header
      height="100vh"
      :breadcrumb="listBreadcrumb"
      :item-height="46"
      :loading="loading"
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
