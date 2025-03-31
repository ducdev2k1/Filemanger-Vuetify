<script setup lang="ts">
  import { formatDate } from '@/utils/my-function';

  interface IProps {
    dataRow: string | Date;
  }

  const props = defineProps<IProps>();
  const dataRow = computed(() => props.dataRow);
</script>

<template>
  <span class="c-file-manager_date">{{ formatDate(dataRow) }}</span>
</template>
