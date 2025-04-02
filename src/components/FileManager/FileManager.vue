<script setup lang="ts">
  import { columnsDefault } from '@/components/FileManager/partial/ConfigFileManager';
  import { IColumnFileMangerV2 } from '@/interfaces';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { FilemanagerActionStore } from '@/stores/FilemanagerActionStore';
  import { EnumLocalStorageKey, EnumViewModeFm } from '@/utils/MyEnum';
  import { convertBytes } from '@/utils/MyFunction';
  import { useStorage } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    theme?: string;
    titlePage?: string;
    customColumns?: IColumnFileMangerV2[];
    toolbarShowActionRight?: boolean;
    dataFilemanger: IFileManager[];
    currentPath: string;
    loading?: boolean;
    dateFormat?: string;
    // props data table vuetify
    showCheckbox?: boolean;
    fixedHeader?: boolean;
    itemHeight?: number | string;
    height?: number | string;
    customThumbnailIcon?: (item: IFileManager) => string;
  }
  interface IFetchParams {
    refresh?: boolean;
    isLoadMore?: boolean;
  }

  const emits = defineEmits(['scroll', 'doubleClickRow', 'clickRow']);

  // const selectedItems = defineModel('selectedItems', { default: [] });

  const props = withDefaults(defineProps<IProps>(), {
    toolbarShowActionRight: true,
    loading: false,
  });

  // Stores
  const fileManagerActionStore = FilemanagerActionStore();

  // localStorage
  const viewFM = useStorage(EnumLocalStorageKey.viewFM, EnumViewModeFm.details, localStorage, {
    listenToStorageChanges: true,
  });

  // Computed
  const loading = computed(() => props.loading);
  const dataFilemanger = computed(() => props.dataFilemanger);
  const customColumns = computed(() => props.customColumns || columnsDefault);
  const showContextMenu = computed(() => fileManagerActionStore.showContextMenu || false);
  const dateFormat = computed(() => props.dateFormat || 'DD/MM/YYYY');
  const showCheckbox = computed(() => props.showCheckbox || false);
  const fixedHeader = computed(() => props.fixedHeader || false);
  const itemHeight = computed(() => props.itemHeight || 56);
  const height = computed(() => props.height || '100%');
  const theme = computed(() => props.theme || 'light');

  const contextMenuOptions = [
    {
      type: 'action',
      label: 'Xem chi tiết',
      icon: 'icon-eye',
      action: 'detail',
    },
    {
      type: 'action',
      label: 'Tải xuống',
      icon: 'icon-download',
      action: 'download',
    },
  ];
</script>

<template>
  <!--- B: Custom default toolbar --->
  <!-- <div class="relative">
    <div class="c-file-manager_toolbar">
      <ToolbarPage
        :page="titlePage"
        :class="{ 'opacity-0 invisible': selectedItems.length > 0 && width > breakPoint.brSpLandscape }"
        :show-action-right="toolbarShowActionRight"
        @call-back="(data) => actionHandleToolbar(data)">
        <template #actionLeft>
          <GroupActionFilter
            v-if="route.path === myRoute.search"
            @action-callback-submit="() => actionHandleToolbar({ type: 'filter', value: '' })" />
        </template>
      </ToolbarPage>
    </div>
    <ActionSelectFile
      :action-selection="toolbarMenuOptions"
      :class="[selectedItems.length > 0 ? 'opacity-1 visible' : 'opacity-0 invisible']"
      @action-callback-clear-selection="() => handleClearSelection()" />
  </div> -->
  <!---E: Custom default toolbar --->

  <!-- <template
    v-if="(route.path === myRoute.myFiles || route.path === myRoute.sharePublic) && width > breakPoint.brSpLandscape">
    <Breadcrumbs
      :class="{ thumbnails: viewFM === EnumViewModeFm.thumbnails }"
      @callBackFolderSelected="actionBreadCrumbClick()" />
  </template> -->

  <!--  B: Slot này dùng để chèn UI/UX mở rộng cần thiết -->
  <!-- <slot v-if="$slots['toolbar-bottom']" name="toolbar-bottom" v-bind="{ data: dataFileManager }"></slot> -->
  <!--  E: Slot này dùng để chèn UI/UX mở rộng cần thiết -->
  <!---B: FILE MANAGER ---->
  <TableFilemanager
    v-bind="$attrs"
    v-if="viewFM === EnumViewModeFm.details"
    :header-table="customColumns"
    :data-table="dataFilemanger"
    :fixed-header="fixedHeader"
    :loading="loading"
    :item-height="itemHeight"
    :height="height"
    :showCheckbox="showCheckbox"
    @double-click-row="emits('doubleClickRow')"
    @loadMoreItem="emits('scroll')"
    @click-row="emits('clickRow')">
    <template v-if="customColumns.length > 0">
      <slot v-for="item in customColumns" :key="item.key" :name="`item.${item.key}`" v-bind="{ item, value }" />
    </template>
    <template #item.name="{ item }" v-if="!$slots['item.name']">
      <ColumnName :data-row="item" />
    </template>
    <template #item.size="{ value }" v-if="!$slots['item.size']">
      <span class="c-file-manager_size">{{ value > 0 ? convertBytes(value) : '--' }}</span>
    </template>
    <template #item.lastModified="{ value }" v-if="!$slots['item.lastModified']">
      <ColumnDateModified :data-row="value" :format="dateFormat" />
    </template>

    <!-- 
    <template #item.owner="{ value }">
      <ColumnOwner :data-owner="value" />
    </template>
    <template #item.lastModified="{ value }">
      <ColumnDateModified :data-row="value" />
    </template>
   
    <template #item.time_deleted="{ value }">
      <ColumnTimeDeleted :data-row="value" />
    </template>
    <template #item.permission="{ item }">
      <ColumnPermissionFile :data-row="item" />
    </template>
    <template #item.path="{ item }">
      <ColumnLocation :data-row="item" />
    </template>
    <template #item.groupActions="{ item }">
      <ColumnGroupActions :data-file="item" />
    </template> -->
  </TableFilemanager>

  <template v-else-if="viewFM === EnumViewModeFm.thumbnails">
    <GridItem
      :loading="loading"
      :list-data="dataFilemanger"
      @download="emits('download')"
      @detail="emits('detail')"
      @load="emits('scroll')"
      @double-click="emits('doubleClickRow')" />
  </template>
  <!-- :is-loading-more="isLoadingMore" -->

  <!---E: FILE MANAGER ---->

  <!---B: ContextMenu MOBILE--->
  <!-- <ContextMenu v-if="showContextMenu" :action-context-menu-items="contextMenuOptions" /> -->
  <!---E: ContextMenu MOBILE--->
</template>
