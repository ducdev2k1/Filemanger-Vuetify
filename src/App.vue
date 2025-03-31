<script setup lang="ts">
  import { dataFilemanager } from '@/data/DataFilemanager';
</script>

<template>
  <h3>ducnd</h3>
  <FileManager :data-filemanager="dataFilemanager" currentPath="" />
</template>
