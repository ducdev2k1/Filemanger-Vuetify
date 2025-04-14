<script setup lang="ts">
  import { DemoActionFM } from './data/DemoActionFm';
  import { IActionFM } from './interfaces';
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

  const onClickActionFm = (option: IActionFM) => {
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

  const handleClickBreadCrumb = ({ data, refresh }: { data?: IFileManager; refresh?: boolean } = {}) => {
    if (refresh) {
      window.location.reload();
    } else {
      console.log('handleClickBreadCrumb :>> ', data);
    }
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
      text-bread="Demo"
      currentPath=""
      return-object
      fixed-header
      height="100vh"
      :breadcrumb="listBreadcrumb"
      :action-toolbar="DemoActionFM"
      :item-height="46"
      :loading="loading"
      :theme="'dark'"
      :show-checkbox="false"
      :update-selected="(data) => (selectedItems = data)"
      :update-selected-one="(data) => (selectedOneItem = data)"
      :custom-thumbnail-icon="getThumbnailIcon"
      :context-menu-click="onClickActionFm"
      :toolbar-click="onClickActionFm"
      :on-click-row="handleClickRow"
      :on-click-breadcrumb="handleClickBreadCrumb"
      :double-click-row="handleDoubleClickRow"
      @scroll="handleScroll"
      @refresh="handleRefresh" />
  </div>
</template>
