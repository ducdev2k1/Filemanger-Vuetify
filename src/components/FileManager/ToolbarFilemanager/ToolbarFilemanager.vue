<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
  import { IActionFM } from '@/interfaces';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    loading?: boolean;
    showSwitchView?: boolean;
    actionToolbar?: IActionFM[];

    toolbarClick?: (item: IActionFM) => void;
  }

  const props = withDefaults(defineProps<IProps>(), {
    loading: false,
    showSwitchView: true,
  });

  const emits = defineEmits(['refresh']);

  const onClick = (item: IActionFM) => {
    props.toolbarClick && props.toolbarClick(item);
  };
</script>

<template>
  <section class="c-file-manager_toolbar" v-bind="$attrs">
    <div class="c-file-manager_toolbar_left">
      <slot name="fmToolbarLeft" />
    </div>
    <v-divider v-if="actionToolbar && actionToolbar.length > 0" :thickness="1" vertical />

    <template v-for="action in actionToolbar" :key="action.key">
      <BtnBaseIcon :icon="action.icon as string" @click="onClick(action)" :disabled="action.disabled" />
    </template>
    <v-divider :thickness="1" vertical />
    <BtnBaseIcon :disabled="loading" :icon="MdiWebfont.reload" @click="emits('refresh')" />
    <BtnSwicthView v-if="showSwitchView" />
  </section>
</template>
