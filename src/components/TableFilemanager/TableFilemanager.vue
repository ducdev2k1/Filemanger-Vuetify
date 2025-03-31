<script setup lang="ts">
  import { useTableFilemanager } from '@/components/v1/FileManager/partial/TableFilemanager/useTableFilemanager';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { FileManagerActionStore } from '@/stores/user/file-manager-action-store';
  import { EnumEmpty, EnumLocalStorageKey, EnumViewModeFm } from '@/utils/my-enum';
  import { addEventKeyDown } from '@/utils/my-function';
  import { useStorage } from '@vueuse/core';

  defineOptions({
    inheritAttrs: false,
  });

  interface ITableFilemanagerProps {
    headerTable: any[];
    dataTable: any[];
  }

  // Composables and stores
  const viewFM = useStorage(EnumLocalStorageKey.viewFM, EnumViewModeFm.details, localStorage, {
    listenToStorageChanges: true,
  });
  const fileManagerActionStore = FileManagerActionStore();

  // Props and emits
  const props = defineProps<ITableFilemanagerProps>();
  const emits = defineEmits(['loadMoreItem', 'doubleClickRow', 'clickRow']);

  // Tạo đối tượng emits để truyền vào useGridItem
  const emitFunctions = {
    loadMoreItem: () => emits('loadMoreItem'),
    doubleClick: (file: IFileManager) => emits('doubleClickRow', file),
    clickRow: (file: IFileManager) => emits('clickRow', file),
  };

  // Refs
  const tableRef = ref<HTMLElement | null>(null);

  // Computed properties
  const headerTable = computed(() => props.headerTable);
  const dataTable = computed(() => props.dataTable);

  const {
    selectedItems,
    isMobile,
    isHomePage,
    wrapperRef,
    heightTable,
    singleModeSelect,
    hoveredRowIndex,
    isItemSelected,
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
  } = useTableFilemanager(dataTable, emitFunctions);

  // Lifecycle hooks
  onMounted(() => {
    if (tableRef.value && viewFM.value === EnumViewModeFm.details) {
      // Add event listeners
      if (!isHomePage.value) {
        addEventKeyDown(keydownHandler);
      }

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
      ref="tableRef"
      id="data-table-virtual"
      class="c-data-table-virtual noselect relative"
      v-model="selectedItems"
      :select-strategy="singleModeSelect ? 'single' : 'page'"
      :headers="headerTable"
      :items="dataTable"
      :show-select="isMobile"
      :hide-default-header="isMobile"
      :height="heightTable"
      v-bind="$attrs"
      fixed-header
      density="compact"
      return-object
      item-height="56"
      hover>
      <!-- Slots -->
      <template #top v-if="$slots.top">
        <slot name="top" />
      </template>
      <template #bottom v-if="$slots.bottom">
        <slot name="bottom" />
      </template>

      <!-- Table rows -->
      <template v-slot:item="{ item, index }">
        <tr
          @contextmenu="rightClickHandler($event, item)"
          @click="rowClickHandler($event, item)"
          @dblclick="rowDoubleClickHandler($event, item)"
          @touchstart="touchStartHandler($event)"
          @touchend="touchEndHandler($event, item)"
          @mouseenter="mouseEnterHandler(index)"
          @mouseleave="mouseLeaveHandler"
          @mousedown="startSelection($event, item)"
          @mousemove="updateSelection($event, item)"
          @mouseup="stopSelection"
          :class="{
            'c-data-table-virtual__hovered': hoveredRowIndex === index,
            'c-data-table-virtual__selected': isItemSelected(item),
            'c-data-table-virtual__selected-one': isItemSelectedOne(item),
          }">
          <!-- Checkbox column for mobile -->
          <td class="text-center c-data-table-virtual__col-checkbox" style="width: 50px" v-if="isMobile">
            <v-checkbox
              :model-value="isItemSelected(item)"
              hide-details
              @click.stop="handleCheckboxClick($event, item)" />
          </td>

          <!-- Data columns -->
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

      <!-- Empty state -->
      <template #no-data>
        <Empty :type-empty="EnumEmpty.no_data" hide-button />
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
  </div>
</template>
