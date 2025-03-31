<script setup lang="ts">
  import * as lucideIcons from 'lucide-vue-next';
  import { SVGAttributes } from 'vue';

  export type Icon = keyof typeof lucideIcons;

  defineOptions({
    inheritAttrs: false,
  });

  interface LucideProps extends /* @vue-ignore */ SVGAttributes {
    icon: any;
    title?: string;
  }

  const props = defineProps<LucideProps>();

  const icon = computed(() => props.icon as Icon);
</script>

<template>
  <component :is="lucideIcons[icon]" class="h-4 w-4" v-bind="$attrs" />
</template>
