<script setup lang="ts">
  import { MdiWebfont } from '@/components/Icons/mdi-font-icons';

  defineOptions({
    inheritAttrs: false,
  });

  interface IProps {
    loading?: boolean;
    showSwitchView?: boolean;
  }

  withDefaults(defineProps<IProps>(), {
    loading: false,
    showSwitchView: true,
  });

  const emits = defineEmits(['refresh']);
</script>

<template>
  <section class="c-file-manager_toolbar" v-bind="$attrs">
    <div class="c-file-manager_toolbar_left">
      <slot v-if="$slots['filemanager-toolbar-left']" name="filemanager-toolbar-left" />
      <template v-else>
        <BaseBtnIcon :disabled="loading" :icon="MdiWebfont.reload" @click="emits('refresh')" />
        <BaseBtnIcon :disabled="loading" :icon="MdiWebfont.reload" @click="emits('refresh')" />
      </template>
    </div>
    <BaseBtnIcon :disabled="loading" :icon="MdiWebfont.reload" @click="emits('refresh')" />
    <BtnSwicthView v-if="showSwitchView" />
  </section>
</template>
