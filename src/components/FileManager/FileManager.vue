<script setup lang="ts">
  import { columnsDefault } from '@/components/FileManager/partial/ConfigFileManager';
  import { demoDataFilemanager } from '@/data/DataFilemanager';
  import { IColumnFileMangerV2 } from '@/interfaces';
  import { IContextMenu } from '@/interfaces/IContextMenu';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { EnumLocalStorageKey, EnumViewModeFm } from '@/utils/MyEnum';
  import { convertBytes } from '@/utils/MyFunction';
  import { useStorage } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    theme?: 'dark' | 'light';
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
    singleModeSelect?: boolean;
    hideDefaultHeader?: boolean;
    contextMenuOptions?: IContextMenu[];

    // void
    updateSelected: (data: IFileManager[]) => void;
    updateSelectedOne: (data: IFileManager) => void;
    customThumbnailIcon?: (item: IFileManager) => void;
    updateSelectedItems?: (data: IFileManager[]) => void;
    contextMenuClick?: (option: IContextMenu) => void;
    onClickRow?: (item: IFileManager) => void;
    doubleClickRow?: (item: IFileManager) => void;
    clickContextMenu?: (option: IContextMenu) => void;
  }

  const emits = defineEmits(['scroll', 'clickContextMenu', 'onClickItem', 'refresh']);

  const props = withDefaults(defineProps<IProps>(), {
    toolbarShowActionRight: true,
    loading: false,
    singleModeSelect: false,
    hideDefaultHeader: false,
    height: '100%',
    theme: 'light',
    itemHeight: 46,
    fixedHeader: false,
    showCheckbox: false,
    dateFormat: 'DD/MM/YYYY',
  });

  // localStorage
  const viewFM = useStorage(EnumLocalStorageKey.viewFileMamager, EnumViewModeFm.details, localStorage, {
    listenToStorageChanges: true,
  });

  // Refs
  const showContextMenu = ref(false);
  const selectedItems = ref<IFileManager[]>([]);
  const selectedOneItem = ref<IFileManager>({} as IFileManager);
  const positionContextMenu = ref({ x: 0, y: 0 });

  // Computed
  const customColumns = computed(() => props.customColumns || columnsDefault);
  const dataFilemanger = computed(() => props.dataFilemanger || demoDataFilemanager);

  const contextMenuOptions = reactive<IContextMenu[]>([
    {
      key: 'download',
      title: 'Tải xuống',
      icon: 'mdi-download',
      visible: true,
      disabled: true,
    },
    {
      key: 'delete',
      title: 'Xóa',
      icon: 'mdi-delete',
      visible: true,
    },
  ]);

  // Xử lý hiển thị context menu
  const handleShowContextMenu = (event: MouseEvent, bool: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    showContextMenu.value = bool;
    positionContextMenu.value = { x: event.clientX, y: event.clientY };
  };
</script>

<template>
  <div class="c-file-manager fm_base" :class="{ fm_dark: theme === 'dark', fm_light: theme === 'light' }">
    <ToolbarFilemanager @refresh="emits('refresh')" :loading="loading" />

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
    <slot v-if="$slots['toolbar-bottom']" name="toolbar-bottom" v-bind="{ data: dataFilemanger }"></slot>
    <!--  E: Slot này dùng để chèn UI/UX mở rộng cần thiết -->
    <!---B: FILE MANAGER ---->
    <TableFilemanager
      v-bind="$attrs"
      v-model="selectedItems"
      v-model:selectedOneItem="selectedOneItem"
      v-if="viewFM === EnumViewModeFm.details"
      :update-selected="(data) => updateSelected(data)"
      :update-selected-one="(data) => updateSelectedOne(data)"
      :header-table="customColumns"
      :data-table="dataFilemanger"
      :fixed-header="fixedHeader"
      :loading="loading"
      :item-height="itemHeight"
      :height="height"
      :select-strategy="singleModeSelect ? 'single' : 'page'"
      :hide-default-header="hideDefaultHeader"
      :show-checkbox="showCheckbox"
      @toglle-context-menu="(e, bool) => handleShowContextMenu(e, bool)"
      @double-click-row="(data) => doubleClickRow && doubleClickRow(data)"
      @click-row="(data) => onClickRow && onClickRow(data)"
      @load-more="emits('scroll')">
      <template v-if="customColumns.length > 0">
        <slot
          v-for="item in customColumns"
          :key="item.key"
          :name="`item.${item.key}`"
          v-bind="{ item, value: item.key }" />
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

      <template #no-data.table v-if="$slots['no-data']">
        <slot name="no-data" />
      </template>
    </TableFilemanager>
    <!--
    <template v-else-if="viewFM === EnumViewModeFm.thumbnails">
      <GridItem
        :loading="loading"
        :list-data="dataFilemanger"
        @load="emits('scroll')"
        @double-click="emits('doubleClickRow')" />
    </template> -->
    <!-- :is-loading-more="isLoadingMore" -->

    <!---E: FILE MANAGER ---->

    <!---B: ContextMenu MOBILE--->
    <!-- <ContextMenu >
      <slot v-if="$slots['context-menu']" name="context-menu" />
    </ContextMenu> -->
    <FmContextMenu
      v-if="showContextMenu"
      :items="contextMenuOptions"
      :on-click-item="props.contextMenuClick"
      :positionContextMenu="positionContextMenu" />
    <!---E: ContextMenu MOBILE--->
  </div>
</template>
