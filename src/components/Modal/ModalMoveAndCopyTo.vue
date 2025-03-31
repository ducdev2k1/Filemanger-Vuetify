<script setup lang="ts">
  import { fmActionCopyFile, fmActionMoveFile } from '@/components/v1/FileManager/partial/ConfigActionFileManager';
  import { IRequestDataDto } from '@/interfaces/dto/IRequestDataDto';
  import { IFileManager } from '@/interfaces/IFileManager';
  import { t } from '@/plugins/i18n';
  import { FileManagerStore } from '@/stores/user/file-manager-store';
  import { BreadcumbStore } from '@/stores/user/ui-store/breadcumb-store';
  import { UploadFileStore } from '@/stores/user/upload-file-store';
  import { EnumActionFileManager, EnumStatusHttpResponse } from '@/utils/my-enum';
  import { fmExtractObjectKeyName } from '@/utils/my-function';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    typeModal?: EnumActionFileManager;
  }

  const emit = defineEmits(['close', 'submit']);

  const props = withDefaults(defineProps<IProps>(), {
    typeModal: EnumActionFileManager.copy_to_custom,
  });

  const uploadFileStore = UploadFileStore();
  const fileManagerStore = FileManagerStore();
  const breadcumbStore = BreadcumbStore();
  const selectedItems = computed(() => fileManagerStore.selectedItems as IFileManager[]);
  const typeModal = computed(() => props?.typeModal as EnumActionFileManager);
  const isDisableBtn = ref(false);
  const isLoading = ref(false);
  const isLoadingBtn = ref(false);
  const pathSelected = ref('');
  const dataTreeFolder = ref([] as IFileManager[]);

  const fetchFolderList = async (path: string) => {
    const request = { data: { path } } as IRequestDataDto;
    return await fileManagerStore.actionGetFolderList(request);
  };

  const getListFolder = async () => {
    isLoading.value = true;
    const response = await fetchFolderList('');
    dataTreeFolder.value = response.data;
    isLoading.value = false;
  };

  const actionLoadChildrenFolder = async (data: IFileManager) => {
    const responseChild = await fetchFolderList(data.path);
    if (responseChild.data.length === 0) return;

    const updateChildren = (parent: IFileManager, childrenData: IFileManager[]) => {
      childrenData.forEach((child) => {
        const existingChild = parent.children?.find((item) => item.path === child.path);
        if (existingChild) {
          // Nếu đã tồn tại, tiếp tục tải thêm con của nó
          actionLoadChildrenFolder(existingChild);
        } else {
          // Nếu chưa có, thêm vào danh sách children
          parent.children = [...(parent.children || []), child];
        }
      });
    };

    const findAndUpdate = (nodes: IFileManager[]) => {
      for (const item of nodes) {
        if (item.path === data.path) {
          updateChildren(item, responseChild.data);
          return;
        }
        if (item.children?.length) {
          findAndUpdate(item.children);
        }
      }
    };

    findAndUpdate(dataTreeFolder.value);
  };

  const customItemProps = (item: any) => {
    return {
      disabled: selectedItems.value.some((value) => value.path === item.path),
    };
  };

  const handleCopyOrMove = async () => {
    isLoadingBtn.value = true;
    isDisableBtn.value = true;

    const promises: Promise<EnumStatusHttpResponse.success | undefined>[] = [];
    // xu ly tung selected
    for (const item of selectedItems.value) {
      if (typeModal.value === EnumActionFileManager.copy_to_custom) {
        promises.push(fmActionCopyFile(item, pathSelected.value));
      } else if (typeModal.value === EnumActionFileManager.move_to_custom) {
        promises.push(fmActionMoveFile(item, pathSelected.value));
      }
    }

    const results = await Promise.all(promises);
    if (results.every((value) => value)) {
      uploadFileStore.actionUpdateCurrentPath(pathSelected.value);
      // extract path folder
      const splitPath = pathSelected.value.split('/');
      if (Array.isArray(splitPath)) {
        // Tách chuỗi theo dấu "/" và loại bỏ phần rỗng
        const parts = pathSelected.value.split('/').filter((part) => part !== '');

        const paths: IFileManager[] = [];

        // Tạo tất cả các đường dẫn con từ chuỗi theo thứ tự giảm dần
        for (let i = 1; i <= parts.length; i++) {
          const subPath = parts.slice(0, i).join('/') + '/';
          if (subPath) {
            const { name } = fmExtractObjectKeyName(subPath);
            // truong hop name bang rong ==> dang o root nen ko co name ===> dung path
            const namePath = !name && subPath.endsWith('/') ? subPath.slice(0, -1) : name;
            paths.push({
              path: subPath,
              name: namePath,
            } as IFileManager);
          }
        }
        if (paths.length > 0) {
          breadcumbStore.actionSetBreadcumbs(paths);
        }
      }
      emit('submit');
      emit('close');
    }
    isLoadingBtn.value = false;
    isDisableBtn.value = false;
  };

  const handleItemClick = (folderSelecteds: string[]) => {
    // Vi thu vien tra kieu array ===> luon lay phan tu index = 0
    if (Array.isArray(folderSelecteds) && folderSelecteds.length === 1) {
      pathSelected.value = folderSelecteds[0];
    } else {
      pathSelected.value = '';
    }
  };

  onMounted(async () => {
    await getListFolder();
  });
</script>

<template>
  <Modal v-bind="$attrs" class="!w-[480px] c-modal-move-and-copy" @close="emit('close')">
    <template #title>
      <h3>
        {{
          typeModal === EnumActionFileManager.move_to_custom ? t('locale.move_to_custom') : t('locale.copy_to_custom')
        }}
      </h3>
    </template>
    <template #content>
      <BtnBase class="c-btn-border" :title="t('locale.home')" icon="home" @click="pathSelected = ''" />
      <div v-if="isLoading" class="h-[200px] flex items-center justify-center">
        <CircularLoader :text="t('$vuetify.loading')" />
      </div>
      <v-treeview
        v-else
        @update:activated="(value) => handleItemClick(value as string[])"
        class="c-treeview-folder"
        density="compact"
        :items="dataTreeFolder"
        :load-children="(item) => actionLoadChildrenFolder(item as IFileManager)"
        max-height="800"
        min-height="240"
        activatable
        :item-props="customItemProps"
        item-title="name"
        item-value="path">
        <template v-slot:prepend="{ isOpen, item }">
          <img
            :src="`./assets/icons/office/${isOpen ? 'folder-open.svg' : 'folder.svg'}`"
            width="26"
            height="26"
            :alt="item.name" />
        </template>
      </v-treeview>
    </template>
    <template #actions>
      <BtnBase class="c-btn-border" :title="t('$vuetify.close')" icon="X" @click="() => emit('close')" />
      <BtnBase
        class="c-btn-primary"
        :title="t('locale.paste')"
        icon="Save"
        :loading="isLoadingBtn"
        :disabled="isDisableBtn"
        @click="handleCopyOrMove" />
    </template>
  </Modal>
</template>
