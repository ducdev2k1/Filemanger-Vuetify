<script setup lang="ts">
  import { useTableFilemanager } from '@/components/FileManager/TableFilemanager/useTableFilemanager';
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { FileManagerActionStore } from '@/stores/FileManagerActionStore';
  import { EnumLocalStorageKey, EnumViewModeFm } from '@/utils/MyEnum';
  import { addEventKeyDown } from '@/utils/MyFunction';
  import { useStorage } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  interface ITableFilemanagerProps {
    headerTable: any[];
    dataTable: any[];
    showCheckbox?: boolean;
    itemHeight?: number;
    // void
    updateSelected: (data: IFileManager[]) => void;
    updateSelectedOne: (data: IFileManager) => void;
  }

  // Composables and stores
  const viewFM = useStorage(EnumLocalStorageKey.viewFM, EnumViewModeFm.details, localStorage, {
    listenToStorageChanges: true,
  });
  const fileManagerActionStore = FileManagerActionStore();

  // Props and emits
  const props = defineProps<ITableFilemanagerProps>();
  const emits = defineEmits(['loadMore', 'doubleClickRow', 'clickRow', 'toglleContextMenu']);

  // Tạo đối tượng Emits để truyền vào useGridItem
  const emitFunctions = {
    loadMoreItem: () => emits('loadMore'),
    doubleClick: (file: IFileManager) => emits('doubleClickRow', file),
    clickRow: (file: IFileManager) => emits('clickRow', file),
    toglleContextMenu: (event: MouseEvent, bool: boolean) => emits('toglleContextMenu', event, bool),
  };

  // Tạo đối tượng Props để truyền vào useGridItem
  const propsFunctions = {
    updateSelected: (file: IFileManager[]) => props.updateSelected(file),
    updateSelectedOne: (file: IFileManager) => props.updateSelectedOne(file),
  };

  // Refs
  const tableRef = ref<HTMLElement | null>(null);

  // Computed properties
  const headerTable = computed(() => props.headerTable);
  const dataTable = computed(() => props.dataTable);
  const showCheckbox = computed(() => props.showCheckbox || false);
  const itemHeight = computed(() => props.itemHeight);
  // const singleModeSelect = computed(() => props.singleModeSelect || false);

  const {
    selectedItems,
    wrapperRef,
    heightTable,
    hoveredRowIndex,
    isItemSelected,
    selectAllItems,
    handleCheckboxClick,
    mouseLeaveHandler,
    isItemSelectedOne,
    rightClickHandler,
    rowClickHandler,
    rowDoubleClickHandler,
    touchEndHandler,
    keydownHandler,
    touchStartHandler,
    mouseEnterHandler,
    startSelection,
    updateSelection,
    stopSelection,
    handleScroll,
    handleClearSelected,
  } = useTableFilemanager(dataTable, emitFunctions, propsFunctions);

  // Lifecycle hooks
  onMounted(() => {
    if (tableRef.value && viewFM.value === EnumViewModeFm.details) {
      // Add event listeners
      addEventKeyDown(keydownHandler);

      // Add scroll handler after DOM is ready
      setTimeout(() => {
        const tableContainer = document.querySelector('.v-table__wrapper');
        if (tableContainer) {
          requestAnimationFrame(() => {
            tableContainer.addEventListener('scroll', handleScroll);
          });
        }
      }, 500);
    }
  });

  // Clean up event listeners if needed
  onUnmounted(() => {
    const tableContainer = document.querySelector('.v-table__wrapper');
    if (tableContainer) {
      tableContainer.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<template>
  <div ref="wrapperRef" class="c-data-table-virtual_wrapper" @click="fileManagerActionStore.closeContextMenu()">
    <v-data-table-virtual
      v-bind="$attrs"
      ref="tableRef"
      id="data-table-virtual"
      class="c-data-table-virtual noselect relative"
      :headers="headerTable"
      :items="dataTable"
      :show-select="showCheckbox"
      :height="heightTable"
      :item-height="itemHeight"
      density="compact"
      hover>
      <template #top v-if="$slots.top">
        <slot name="top" />
      </template>
      <template #bottom v-if="$slots.bottom">
        <slot name="bottom" />
      </template>

      <!-- <template #headers v-if="selectedItems.length > 0">
        <tr class="c-data-table-virtual__header">
          <th class="text-center c-data-table-virtual__col-checkbox">
            <div class="flex items-center">
              <v-checkbox
                v-if="showCheckbox"
                hide-details
                @click.stop="selectAllItems"
                :model-value="selectedItems.length === dataTable.length" />
              <BtnBase
                :icon="MdiWebfont['close']"
                @click="handleClearSelected"
                :title="`${selectedItems.length} ${t('locale.selected')}`" />
            </div>
          </th>
          <template v-for="header in headerTable.slice(1)" :key="header.key">
            <th :style="{ width: header.width || 'auto' }"></th>
          </template>
        </tr>
      </template> -->

      <template v-slot:item="{ item, index }">
        <tr
          :class="{
            'c-data-table-virtual__hovered': hoveredRowIndex === index,
            'c-data-table-virtual__selected': isItemSelected(item),
            'c-data-table-virtual__selected-one': isItemSelectedOne(item),
          }"
          @contextmenu="rightClickHandler($event, item)"
          @click="rowClickHandler($event, item)"
          @dblclick="rowDoubleClickHandler($event, item)"
          @touchstart="touchStartHandler($event)"
          @touchend="touchEndHandler($event, item)"
          @mouseenter="mouseEnterHandler(index)"
          @mouseleave="mouseLeaveHandler"
          @mousedown="startSelection($event, item)"
          @mousemove="updateSelection($event, item)"
          @mouseup="stopSelection">
          <td class="text-center c-data-table-virtual__col-checkbox" style="width: 50px" v-if="showCheckbox">
            <v-checkbox
              hide-details
              @click.stop="handleCheckboxClick($event, item)"
              :model-value="isItemSelected(item)" />
          </td>

          <template v-for="header in headerTable" :key="header.key">
            <td>
              <slot
                v-if="$slots[`item.${header.key}`]"
                :name="`item.${header.key}`"
                v-bind="{ item, index, value: item[header.key] }" />
              <span v-else>{{ item[header.key] }}</span>
            </td>
          </template>
        </tr>
      </template>

      <template #no-data v-if="$slots['no-data.table']">
        <!-- <Empty :type-empty="EnumEmpty.no_data" hide-button /> -->
        <slot name="no-data.table" />
      </template>

      <!-- Loading indicator -->
      <!-- <template #loading v-if="dataTable.length === 0">
        <SkeletonLoader :type="`${EnumTypeSkeletonLoader.tableTbody}@2`" />
      </template> -->
    </v-data-table-virtual>

    <!-- Mobile loading indicator -->
    <!-- <div class="c-data-table-virtual_loading-mobile" v-if="isMobile && loadingMobile">
      <CircularLoader />
    </div> -->

    <template v-if="selectedItems.length > 0">
      <div class="c-data-table-virtual_header-selected" :style="{ minHeight: `${itemHeight}px` }">
        <v-checkbox
          v-if="showCheckbox"
          hide-details
          @click.stop="selectAllItems"
          :model-value="selectedItems.length === dataTable.length" />
        <BtnBase
          :icon="MdiWebfont['close']"
          @click="handleClearSelected"
          :title="`${selectedItems.length} ${t('locale.selected')}`" />
      </div>
      <!-- <tr class="c-data-table-virtual__header">
        <th class="text-center c-data-table-virtual__col-checkbox">

        </th>

        <template v-for="header in headerTable.slice(1)" :key="header.key">
          <th :style="{ width: header.width || 'auto' }"></th>
        </template>
      </tr> -->
    </template>
  </div>
</template>
