<script setup lang="ts">
  import { dataFilemanager } from '@/data/DataFilemanager';

  const selectedItems = ref<any[]>([]);
</script>

<template>
  <FileManager
    currentPath=""
    v-model="selectedItems"
    return-object
    fixed-header
    item-height="56"
    :dataFilemanger="dataFilemanager"
    :showCheckbox="true" />
</template>
