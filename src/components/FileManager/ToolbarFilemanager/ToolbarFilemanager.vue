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
      <slot name="fmToolbarLeft" />
    </div>
    <v-divider :thickness="1" vertical />
    <BtnBaseIcon :disabled="loading" :icon="MdiWebfont.reload" @click="emits('refresh')" />
    <BtnBaseIcon :disabled="loading" :icon="MdiWebfont.reload" @click="emits('refresh')" />
    <v-divider :thickness="1" vertical />
    <BtnBaseIcon :disabled="loading" :icon="MdiWebfont.reload" @click="emits('refresh')" />
    <BtnSwicthView v-if="showSwitchView" />
  </section>
</template>
