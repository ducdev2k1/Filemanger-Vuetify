<script setup lang="ts">
  import { configContextMenuOptions } from '@/components/v1/FileManager/partial/ConfigContextMenuOptions';
  import { fileManagerGetItems } from '@/components/v1/FileManager/partial/HelperFunctionFileManager';
  import { IColumnFileMangerV2, IToolbarActions } from '@/interfaces';
  import { IRequestDataDto } from '@/interfaces/dto/IRequestDataDto';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { FileManagerActionStore } from '@/stores/user/file-manager-action-store';
  import { FileManagerSearchStore } from '@/stores/user/file-manager-search-store';
  import { FileManagerStore } from '@/stores/user/file-manager-store';
  import { BreadcumbStore } from '@/stores/user/ui-store/breadcumb-store';
  import { UploadFileStore } from '@/stores/user/upload-file-store';
  import { EnumFMType, EnumLocalStorageKey, EnumViewModeFm } from '@/utils/my-enum';
  import { convertBytes, publicPathImage } from '@/utils/my-function';
  import { myRoute } from '@/utils/my-route';
  import { breakPoint, DEFAULT_PAGE_SIZE, mimeType } from '@/utils/my-variables';
  import { useStorage, useWindowSize } from '@vueuse/core';

  interface IProps {
    titlePage?: string;
    customColumns?: IColumnFileMangerV2[];
    toolbarShowActionRight?: boolean;
  }
  interface IFetchParams {
    refresh?: boolean;
    isLoadMore?: boolean;
  }

  const props = withDefaults(defineProps<IProps>(), {
    toolbarShowActionRight: true,
  });

  // Store and VueCore
  const route = useRoute();
  const { width } = useWindowSize();
  const fileManagerStore = FileManagerStore();
  const fileManagerActionStore = FileManagerActionStore();
  const fileManagerSearchStore = FileManagerSearchStore();
  const uploadFileStore = UploadFileStore();
  const breadcumbStore = BreadcumbStore();

  // props
  const titlePage = computed(() => props.titlePage as string);
  const headerTable = computed(() => props.customColumns as IColumnFileMangerV2[]);
  const toolbarShowActionRight = computed(() => props.toolbarShowActionRight);

  const viewFM = useStorage(EnumLocalStorageKey.viewFM, EnumViewModeFm.details, localStorage, {
    listenToStorageChanges: true,
  });

  // Ref
  const fmType = ref(EnumFMType.my_files);
  const dataFileManager = ref([] as IFileManager[]);
  const isLoadingMore = ref(false); // dung cho load more dang thumbnail
  const fmFetchingData = ref(false);
  const observer = ref<MutationObserver | null>(null);
  const startAfterPath = ref('');
  const startMumberMongo = ref(1);

  // Default request object
  const requestFileManager = ref({
    data: {
      page_size: DEFAULT_PAGE_SIZE,
      start_after_path: startAfterPath.value,
      start_number_mongo: 1,
    } as IFileManager,
  } as IRequestDataDto);

  // Computed
  const forceRefreshFileManager = computed(() => uploadFileStore.forceRefreshFileManager);
  const currentPath = computed(() => uploadFileStore.currentPath);
  const selectedItems = computed(() => fileManagerStore.selectedItems);
  const objectSelectedOne = computed(() => fileManagerStore.objectSelectedOne);
  const noAccessDirectory = computed(() => fmType.value === EnumFMType.trash || fmType.value === EnumFMType.search);
  const showContextMenu = computed(() => fileManagerActionStore.showContextMenu || false);
  const time_search = computed(() => route.query.time_search as string);
  const isPathPublic = computed(() => route.path === myRoute.sharePublic || route.query?.public);
  const resetRequestFileManager = computed(() => fileManagerActionStore.resetRequestFileManager);

  const contextMenuOptions = computed(
    () =>
      configContextMenuOptions(route.path, route.query?.share as string, true) as {
        items: IToolbarActions[];
      },
  );

  const toolbarMenuOptions = computed(
    () =>
      configContextMenuOptions(route.path, route.query?.share as string, false) as {
        items: IToolbarActions[];
      },
  );

  const actionHandleToolbar = async (item: { type: string; value: any }) => {
    switch (item.type) {
      case 'refresh':
        await handleRefreshFileManager();
        break;
      case 'view':
        viewFM.value = item.value;
        break;
      case 'filter':
        handleClearSelection();
        await fetchData({ refresh: true });
        break;
    }
  };

  // hàm đặt lại request file manager
  const actionResetRequestFileManager = () => {
    startAfterPath.value = '';
    startMumberMongo.value = 1;
    requestFileManager.value.data = {
      page_size: DEFAULT_PAGE_SIZE,
      start_after_path: '',
      start_number_mongo: 1,
    };
  };

  function handleClearSelection() {
    fileManagerStore.actionSetSelectedItems([] as IFileManager[]);
    fileManagerStore.actionSetObjectSelectedOne({} as IFileManager);
    fileManagerStore.actionSetEmptyObjectSelectedOne();
    fileManagerActionStore.closeContextMenu();
  }

  //Function to fetch data for FileManager
  const fetchData = async ({ refresh, isLoadMore }: IFetchParams = {}) => {
    if (!refresh) {
      dataFileManager.value = [];
    }
    // Update base request with current context data
    requestFileManager.value.data = {
      ...requestFileManager.value.data,
      share_id: objectSelectedOne.value.share_id || route.query?.share_id,
      path: currentPath.value || '',
      tag_id: route.query?.tag as string,
    };

    // Determine file manager type based on route
    const routeMap = {
      [myRoute.myFiles]: EnumFMType.my_files,
      [myRoute.sharePublic]: EnumFMType.share_public,
      [myRoute.trash]: EnumFMType.trash,
      [myRoute.search]: EnumFMType.search,
    };

    // Check if the current route path matches any in the map
    fmType.value = routeMap[route.path] || fmType.value;

    // Handle query parameter cases
    if (route.query.share === myRoute.shareParamsName.byMe) {
      fmType.value = EnumFMType.share_by_me;
    } else if (route.query.share === myRoute.shareParamsName.withMe) {
      fmType.value = EnumFMType.share_with_me;
    } else if (route.query.tag) {
      fmType.value = EnumFMType.tag;
    }

    // Add search data if in search mode
    if (fmType.value === EnumFMType.search) {
      requestFileManager.value.data = {
        ...requestFileManager.value.data,
        ...fileManagerSearchStore.dataSearch,
      };
    }

    // Fetch data
    if (!isLoadMore) {
      fmFetchingData.value = true;
    }
    const newItems = await fileManagerGetItems(requestFileManager, fmType);
    // Update startAfterPath data
    startAfterPath.value = newItems.nextObject;
    await handleGetAllImageInFolder(newItems.data || []);
    if (isLoadMore) {
      dataFileManager.value.push(...newItems.data);
    } else {
      dataFileManager.value = newItems.data;
    }
    fmFetchingData.value = false;
  };

  // Load more data when scrolling
  const handleScroll = async () => {
    if (startAfterPath.value.length > 0) {
      requestFileManager.value.data = {
        ...requestFileManager.value.data,
        start_after_path: startAfterPath.value,
        start_number_mongo: (startMumberMongo.value += 1),
      };

      await fetchData({ refresh: true, isLoadMore: true });
    }
  };

  const handleGetAllImageInFolder = async (data: IFileManager[]) => {
    let listImage = [] as string[];
    data.forEach((item) => {
      if (mimeType.IMAGE.includes(item.mime_type)) {
        const pathImage = publicPathImage(isPathPublic.value, item);
        listImage.push(pathImage);
      }
    });
    fileManagerStore.actionSetListImageInFolder(listImage || []);
  };

  const handleRefreshFileManager = async () => {
    handleClearSelection();
    actionResetRequestFileManager();
    await fetchData({ refresh: true });
  };

  const handleDoubleClickRow = async (dataRow: IFileManager) => {
    // update object selected
    fileManagerStore.actionSetObjectSelectedOne(dataRow);
    // Neu la folder ===> access directory
    if (!noAccessDirectory.value && dataRow.isDirectory) {
      // change object selected one
      uploadFileStore.actionUpdateCurrentPath(dataRow.path);
      // append breadcumb
      breadcumbStore.actionAppendBreadcumbs(dataRow);
      // clear selection
      handleClearSelection();
      // Đặt lại request file manager
      actionResetRequestFileManager();
      // reload
      await fetchData();
    }
    // Open preview file
    else {
      fileManagerActionStore.toggleModalPreview();
    }
  };

  const actionBreadCrumbClick = async () => {
    // Lấy phần tử cuối cùng của breadcumb
    const lastBreadcrumb = breadcumbStore.breadcumbs.at(-1);
    // Cập nhật đường dẫn
    uploadFileStore.actionUpdateCurrentPath(lastBreadcrumb?.path ?? '');
    // Xóa lựa chọn hiện tại
    handleClearSelection();
    // Đặt lại request file manager
    actionResetRequestFileManager();
    // Fetch lại dữ liệu
    await fetchData();
  };

  // Xử lý button back folder trên mobile
  const initObserver = (): void => {
    observer.value = new MutationObserver((mutations: MutationRecord[], obs: MutationObserver) => {
      const button = document.getElementById('btn-parent-directory') as HTMLButtonElement | null;

      if (button) {
        button.addEventListener('click', () => {
          // Back folder
          breadcumbStore.actionPopBreadcumbs();
          // Reload data FM
          actionBreadCrumbClick();
        });
        obs.disconnect(); // Ngừng quan sát khi tìm thấy
      }
    });

    const header = document.querySelector('header') as HTMLElement;
    // Bắt đầu quan sát
    if (header) {
      observer.value.observe(header, {
        childList: true,
        subtree: true,
      });
    }
  };

  watch(
    () => time_search.value,
    async (value) => {
      if (value) {
        handleClearSelection();
        breadcumbStore.actionClearBreadcumbs();
        await fetchData();
      }
    },
  );

  // Sự kiện check refresh lại file-manager khi tạo file hoặc folder
  watch(
    () => forceRefreshFileManager.value,
    async () => {
      if (forceRefreshFileManager.value > 0) {
        //refresh all
        handleClearSelection();
        breadcumbStore.actionClearBreadcumbs();
        actionResetRequestFileManager();
        await fetchData({ refresh: true });
      }
    },
  );

  // Sự kiện check reset request file-manager
  watch(
    () => resetRequestFileManager.value,
    (newValue) => {
      if (newValue > 0) {
        actionResetRequestFileManager();
      }
    },
  );

  onMounted(async () => {
    if (forceRefreshFileManager.value <= 0) {
      await fetchData();
    }
    // Khởi tạo và bắt đầu quan sát header trên mobile
    if (width.value <= breakPoint.brSpLandscape) {
      initObserver();
    }
  });

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect(); // stop watching
      observer.value = null;
    }
  });

  defineExpose({
    handleRefreshFileManager,
    handleClearSelection,
  });
</script>

<template>
  <!--- B: Custom default toolbar --->
  <div class="relative">
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
  </div>
  <!---E: Custom default toolbar --->

  <template
    v-if="(route.path === myRoute.myFiles || route.path === myRoute.sharePublic) && width > breakPoint.brSpLandscape">
    <Breadcrumbs
      :class="{ thumbnails: viewFM === EnumViewModeFm.thumbnails }"
      @callBackFolderSelected="actionBreadCrumbClick()" />
  </template>

  <!--  B: Slot này dùng để chèn UI/UX mở rộng cần thiết -->
  <slot v-if="$slots['toolbar-bottom']" name="toolbar-bottom" v-bind="{ data: dataFileManager }"></slot>
  <!--  E: Slot này dùng để chèn UI/UX mở rộng cần thiết -->
  <!---B: FILE MANAGER ---->
  <TableFilemanager
    v-if="viewFM === EnumViewModeFm.details"
    :header-table="headerTable"
    :data-table="dataFileManager"
    :loading="fmFetchingData"
    @double-click-row="handleDoubleClickRow"
    @loadMoreItem="handleScroll"
    @click-row="{}">
    <template #item.name="{ item }">
      <ColumnName :data-row="item" />
    </template>
    <template #item.owner="{ value }">
      <ColumnOwner :data-owner="value" />
    </template>
    <template #item.lastModified="{ value }">
      <ColumnDateModified :data-row="value" />
    </template>
    <template #item.size="{ value }">
      <span class="c-file-manager_size">{{ value > 0 ? convertBytes(value) : '--' }}</span>
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
    </template>
  </TableFilemanager>

  <template v-else-if="viewFM === EnumViewModeFm.thumbnails">
    <GridItem
      :loading="fmFetchingData"
      :list-data="dataFileManager"
      :is-loading-more="isLoadingMore"
      @load="handleScroll"
      @double-click="handleDoubleClickRow" />
  </template>

  <!---E: FILE MANAGER ---->

  <!---B: ContextMenu MOBILE--->
  <ContextMenu v-if="showContextMenu" :action-context-menu-items="contextMenuOptions" />
  <!---E: ContextMenu MOBILE--->
</template>
