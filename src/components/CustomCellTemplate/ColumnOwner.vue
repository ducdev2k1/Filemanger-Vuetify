<script setup lang="ts">
  import { IFileManagerSharedWith } from '@/interfaces/IFileManagerShare';
  import { t } from '@/plugins/i18n';
  import { isByMe } from '@/utils/my-function';

  interface IProps {
    dataOwner: IFileManagerSharedWith;
  }

  const props = defineProps<IProps>();
  const dataOwner = computed(() => props.dataOwner);
</script>

<template>
  <div class="flex items-center gap-2" v-bind="$attrs">
    <Avatar
      :full-name="(dataOwner as IFileManagerSharedWith).account"
      :only-color="isByMe((dataOwner as IFileManagerSharedWith).account)"
      size="26" />
    <span class="line-clamp-1">
      {{
        isByMe((dataOwner as IFileManagerSharedWith).account)
          ? t('locale.me')
          : (dataOwner as IFileManagerSharedWith).account
      }}
      <v-tooltip
        v-if="
          (dataOwner as IFileManagerSharedWith).account.length > 20 ||
          isByMe((dataOwner as IFileManagerSharedWith).account)
        "
        activator="parent"
        location="bottom center">
        {{ (dataOwner as IFileManagerSharedWith).account }}
      </v-tooltip>
    </span>
  </div>
</template>
