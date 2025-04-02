// import { fmActionRestoreTrash } from '@/components/v1/FileManager/partial/ConfigActionFileManager';
import { IFileManager } from '@/interfaces/IFileManager';
import { FilemanagerActionStore } from '@/stores/FilemanagerActionStore';
import { FileManagerStore } from '@/stores/FileManagerStore';
// import { myRoute } from '@/utils/my-route';
import { debounce } from '@/utils/MyFunction';
import { breakPoint } from '@/utils/MyVariables';
import { useWindowSize } from '@vueuse/core';

interface IEmitFunctions {
  loadMoreItem: () => void;
  doubleClick: (file: IFileManager) => void;
  clickRow: (file: IFileManager) => void;
}
export const useTableFilemanager = (dataTable: ComputedRef<IFileManager[]>, emits: IEmitFunctions) => {
  const route = useRoute();
  const fileManagerStore = FileManagerStore();
  const fileManagerActionStore = FilemanagerActionStore();
  const { width } = useWindowSize();

  // Refs
  const previousScrollTop = ref(0);
  const isLoading = ref(false);
  const isSelecting = ref(false);
  const startIndex = ref<number | null>(null);
  const endIndex = ref<number | null>(null);
  const lastSelectedItem = ref<IFileManager | null>(null);
  const touchStartTimer = ref<number>(0);
  const touchStartPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTapTime = ref<number>(0);
  const hoveredRowIndex = ref<number | null>(null);
  const wrapperRef = ref<HTMLElement | null>(null);

  // Constants
  const DOUBLE_TAP_DELAY = 300; // Time threshold for double tap (ms)
  const SCROLL_THRESHOLD = 10; // Distance from bottom before loading more
  const DEBOUNCE_DELAY = 100; // Debounce delay for scroll handling

  // Computed
  // const singleModeSelect = computed(() => route.path === myRoute.sharePublic);
  const isMobile = computed(() => width.value <= breakPoint.brSpLandscape);
  // const isHomePage = computed(() => myRoute.home === route.path);
  const listItemDelete = computed(() => fileManagerStore.listItemDelete);
  const selectedItems = computed({
    get: () => fileManagerStore.selectedItems,
    set: (value: IFileManager[]) => fileManagerStore.actionSetSelectedItems(value),
  });

  // const objectSelectedOne = computed({
  //   get: () => fileManagerStore.objectSelectedOne,
  //   set: (value: IFileManager) => fileManagerStore.actionSetObjectSelectedOne(value),
  // });

  const objectSelectedOne = ref<IFileManager>();
  const heightTable = computed(() => {
    if (wrapperRef.value) {
      return wrapperRef.value.offsetHeight || '100vh';
    }
    return '100%';
  });

  const selectAllItems = () => {
    selectedItems.value = [...dataTable.value];
    return [...dataTable.value];
  };

  // Hàm lấy index của file trong listData
  const getFileIndex = (file: IFileManager) => {
    return dataTable.value.findIndex((item) => item.key === file.key);
  };

  const isItemSelected = (file: IFileManager): boolean => {
    return selectedItems.value.some((selectedItem) => selectedItem.key === file.key);
  };

  const isItemSelectedOne = (file: IFileManager): boolean => {
    return objectSelectedOne.value.key === file.key;
  };

  const mouseEnterHandler = (index: number) => {
    hoveredRowIndex.value = index;
  };

  const mouseLeaveHandler = () => {
    hoveredRowIndex.value = null;
  };

  const rowDoubleClickHandler = (event: MouseEvent | TouchEvent, file: IFileManager) => {
    // Skip if clicking checkbox in mobile view
    if (isMobile.value && (event.target as HTMLElement).closest('.v-checkbox')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    // emits
    emits.doubleClick(file);
  };

  const rowClickHandler = (event: MouseEvent | TouchEvent, file: IFileManager) => {
    // Skip if clicking checkbox in mobile view
    if (isMobile.value && (event.target as HTMLElement).closest('.v-checkbox')) {
      if (selectedItems.value.includes(file)) {
        selectedItems.value = selectedItems.value.filter((item) => item !== file);
      } else {
        selectedItems.value = [...selectedItems.value, file];
      }
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // Close any open context menu
    fileManagerActionStore.closeContextMenu();

    // Update selected items
    // if (isHomePage.value) {
    //   // Home page - Single selection
    //   selectedItems.value = [file];
    //   lastSelectedItem.value = file;
    // } else {
    // }
    // Handle different selection modes
    if ((event as MouseEvent).shiftKey && lastSelectedItem.value) {
      // Shift + Click: Range selection
      handleShiftClick(file, lastSelectedItem.value);
    } else if ((event as MouseEvent).ctrlKey || (event as MouseEvent).metaKey) {
      // Ctrl/Cmd + Click: Toggle selection
      handleCtrlClick(file);
    } else {
      // Normal click: Single selection
      selectedItems.value = [file];
      lastSelectedItem.value = file;
    }

    // Update store and emit event
    objectSelectedOne.value = file;
    emits.clickRow(file);
  };

  const rightClickHandler = (event: MouseEvent, file: IFileManager) => {
    event.preventDefault();
    event.stopPropagation();

    // Open context menu at click position
    fileManagerActionStore.openContextMenu({
      x: event.clientX,
      y: event.clientY,
    });

    // Update selected item state
    fileManagerStore.actionSetObjectSelectedOne(file);

    // Ensure item is in selection
    if (!isItemSelected(file)) {
      fileManagerStore.actionSetSelectedItems([file]);
    }
  };

  const handleShiftClick = (file: IFileManager, lastSelectedItem: IFileManager) => {
    const startIndex = getFileIndex(lastSelectedItem);
    const endIndex = getFileIndex(file);
    if (startIndex !== -1 && endIndex !== -1) {
      const minIndex = Math.min(startIndex, endIndex);
      const maxIndex = Math.max(startIndex, endIndex);
      selectedItems.value = dataTable.value.slice(minIndex, maxIndex + 1);
      return selectedItems;
    }
    return [];
  };

  const handleCtrlClick = (file: IFileManager) => {
    const existingIndex = selectedItems.value.findIndex((item) => item.key === file.key);

    if (existingIndex !== -1) {
      // Remove item if already selected
      selectedItems.value = [...selectedItems.value];
      selectedItems.value.splice(existingIndex, 1);
    } else {
      // Add item to selection
      selectedItems.value = [...selectedItems.value, file];
    }
  };

  // Xử lý sự kiện scroll table
  const handleScroll = debounce((event: Event) => {
    const target = event.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const html = document.querySelector('html');

    // Xử lý lớp CSS dựa trên hướng cuộn
    if (scrollTop > previousScrollTop.value) {
      html?.classList.add('scrolling-down');
    } else if (scrollTop < previousScrollTop.value) {
      html?.classList.remove('scrolling-down');
    }

    // Tải thêm dữ liệu khi cuộn đến khoảng 50%
    if (scrollTop > previousScrollTop.value && !isLoading.value) {
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      if (scrollPercentage >= 0.5) {
        // Kiểm tra khi scroll quá 50%
        isLoading.value = true;
        emits.loadMoreItem();

        // Reset trạng thái loading sau một khoảng thời gian
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      }
    }

    previousScrollTop.value = scrollTop;
  }, 100);

  // Xử lý sự kiện click vào checkbox
  const handleCheckboxClick = (event: Event, file: IFileManager) => {
    event.stopPropagation();

    const isSelected = selectedItems.value.some((selectedItem) => selectedItem.key === file.key);

    if (isSelected) {
      // Remove from selection
      selectedItems.value = selectedItems.value.filter((selectedItem) => selectedItem.key !== file.key);
    } else {
      // Add to selection
      selectedItems.value = [...selectedItems.value, file];
    }

    objectSelectedOne.value = file;
  };

  const keydownHandler = async (event: KeyboardEvent) => {
    event.stopPropagation();

    // Handle keyboard shortcuts
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      return selectAllItems();
    } else if (event.key === 'Delete' && selectedItems.value.length > 0) {
      // Delete => Xóa file
      fileManagerActionStore.toggleModalMoveTrashFile();
    } else if ((event.ctrlKey || event.metaKey) && event.altKey && event.key.toLowerCase() === 'e') {
      // ctrl + alt + e => Mở modal rename file
      if (objectSelectedOne.value && selectedItems.value.length === 1) {
        fileManagerActionStore.toggleModalRenameFile();
      }
    }
    // else if (event.ctrlKey && event.key.toLowerCase() === 'z') {
    //   // ctrl + z => Khôi phục file
    //   if (listItemDelete.value.length > 0) {
    //     await fmActionRestoreTrash(listItemDelete.value);
    //   }
    // }
    return selectedItems;
  };

  // Bắt đầu quá trình chọn nhiều items
  const startSelection = (event: MouseEvent, file: IFileManager) => {
    if (event.button !== 0) return; // Only handle left mouse button
    if (event.ctrlKey || event.metaKey || event.shiftKey) return; // Don't interfere with modifier keys

    event.preventDefault();
    isSelecting.value = true;
    startIndex.value = getFileIndex(file);
    endIndex.value = startIndex.value;
    selectedItems.value = [file];
  };

  // Cập nhật quá trình chọn nhiều items
  const updateSelection = (event: MouseEvent, file: IFileManager) => {
    if (!isSelecting.value) return;

    endIndex.value = getFileIndex(file);

    if (startIndex.value !== null && endIndex.value !== null) {
      const minIndex = Math.min(startIndex.value, endIndex.value);
      const maxIndex = Math.max(startIndex.value, endIndex.value);
      selectedItems.value = dataTable.value.slice(minIndex, maxIndex + 1);
    }
  };

  const stopSelection = () => {
    isSelecting.value = false;
  };

  // Touch events ( mobile )
  const touchStartHandler = (event: TouchEvent) => {
    touchStartTimer.value = Date.now();
    if (event.touches.length > 0) {
      touchStartPosition.value = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
  };

  const touchEndHandler = (event: TouchEvent, item: IFileManager) => {
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTimer.value;

    // Handle tap vs. swipe
    if (touchDuration < 500) {
      const currentTime = Date.now();
      const timeSinceLastTap = currentTime - lastTapTime.value;

      if (timeSinceLastTap < DOUBLE_TAP_DELAY && lastTapTime.value > 0) {
        // Double tap
        event.preventDefault();
        rowDoubleClickHandler(event, item);
        lastTapTime.value = 0;
      } else {
        // Single tap
        event.preventDefault();
        rowClickHandler(event, item);
        lastTapTime.value = currentTime;
      }
    }
  };

  return {
    // Ref
    previousScrollTop,
    isLoading,
    endIndex,
    startIndex,
    isSelecting,
    lastSelectedItem,
    touchStartTimer,
    touchStartPosition,
    lastTapTime,
    hoveredRowIndex,
    wrapperRef,

    // Const
    DOUBLE_TAP_DELAY,
    SCROLL_THRESHOLD,
    DEBOUNCE_DELAY,

    // Computed
    selectedItems,
    objectSelectedOne,
    listItemDelete,
    isMobile,
    // isHomePage,
    heightTable,
    // singleModeSelect,

    // Function
    selectAllItems,
    getFileIndex,
    isItemSelected,
    isItemSelectedOne,
    rightClickHandler,
    handleShiftClick,
    handleCtrlClick,
    handleScroll,
    handleCheckboxClick,
    keydownHandler,
    startSelection,
    updateSelection,
    stopSelection,
    touchStartHandler,
    touchEndHandler,
    rowDoubleClickHandler,
    rowClickHandler,
    mouseEnterHandler,
    mouseLeaveHandler,
  };
};
