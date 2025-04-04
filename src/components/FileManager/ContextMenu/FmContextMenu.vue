<script setup lang="ts">
  import { IContextMenu } from '@/interfaces/IContextMenu';
  import { FileManagerActionStore } from '@/stores/FileManagerActionStore';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    items: IContextMenu[];
    onClickItem?: (menuItem: IContextMenu) => void;
  }

  const props = defineProps<IProps>();

  // Stores
  const fileManagerActionStore = FileManagerActionStore();

  // Refs
  const innerWidth = ref(window.innerWidth);
  const innerHeight = ref(window.innerHeight);
  const contextMenuDesktop = ref<HTMLElement | null>(null);
  // Computed
  const showContextMenu = computed(() => fileManagerActionStore.showContextMenu || false);
  const listMenu = computed(() => props.items);
  const positionContextMenu = computed(() => fileManagerActionStore.positionContextMenu);
  const widthContextMenuDesktop = computed(() => {
    if (contextMenuDesktop.value) {
      return contextMenuDesktop.value.offsetWidth + 50;
    }
    return 350;
  });
  const heightContextMenuDesktop = computed(() => {
    if (contextMenuDesktop.value) {
      return contextMenuDesktop.value.offsetHeight + 50;
    }
    return 0;
  });

  const handleClickItem = (menuItem: IContextMenu) => {
    fileManagerActionStore.toggleContextMenu();
    if (props.onClickItem) {
      props.onClickItem(menuItem);
    }
  };
</script>

<template>
  <div
    v-if="showContextMenu"
    v-bind="$attrs"
    class="c-context-menu fixed z-50"
    ref="contextMenuDesktop"
    :style="{
      top: Math.min(positionContextMenu?.y, innerHeight - heightContextMenuDesktop) + 'px',
      left: Math.min(positionContextMenu?.x, innerWidth - widthContextMenuDesktop) + 'px',
    }">
    <slot v-if="$slots['context-menu-item']" name="context-menu-item" />
    <template v-else>
      <FmContextMenuItem :list-menus="listMenu" :on-click-item="handleClickItem" />
    </template>
  </div>
</template>
