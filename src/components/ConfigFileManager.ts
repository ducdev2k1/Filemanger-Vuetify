import { t } from '@/plugins/i18n';
import { breakPoint } from '@/utils/my-variables';
import { useWindowSize } from '@vueuse/core';

const { width } = useWindowSize();

export const columnsTableFM = {
  my_file: [
    {
      key: 'name',
      title: computed(() => t('locale.backend_data_name')),
      visible: true,
      width: 'auto',
    },
    {
      key: 'owner',
      title: computed(() => t('locale.owner')),
      visible: width.value > breakPoint.brSpLandscape,
      width: '200',
    },
    {
      key: 'lastModified',
      title: computed(() => t('locale.date_modified')),
      visible: width.value > breakPoint.brSpLandscape,
      width: '220',
    },
    {
      key: 'size',
      title: computed(() => t('locale.file_size')),
      visible: width.value > breakPoint.brSpLandscape,
      width: '160',
    },
    {
      key: 'permission',
      title: computed(() => t('locale.my_access')),
      visible: width.value > breakPoint.brSpLandscape,
      width: '230',
    },
    {
      key: 'groupActions',
      title: '',
      visible: true,
      align: 'end',
      width: width.value > breakPoint.brSpLandscape ? '200' : '70',
    },
  ],
  trash: [
    {
      key: 'name',
      title: computed(() => t('locale.backend_data_name')),
      visible: true,
      width: 'auto',
    },
    {
      key: 'time_deleted',
      width: '250',
      title: computed(() => t('locale.deleted_date')),
      visible: width.value > breakPoint.brSpLandscape,
    },
    {
      key: 'size',
      width: '160',
      title: computed(() => t('locale.file_size')),
      visible: width.value > breakPoint.brSpLandscape,
    },
    {
      key: 'groupActions',
      title: '',
      visible: true,
      align: 'end',
      width: width.value > breakPoint.brSpLandscape ? '200' : '100',
    },
  ],
  search: [
    {
      key: 'name',
      title: computed(() => t('locale.backend_data_name')),
      visible: true,
      width: 'auto',
    },
    {
      key: 'owner',
      title: computed(() => t('locale.owner')).value,
      visible: width.value > breakPoint.brTablet,
      width: '200',
    },
    {
      key: 'lastModified',
      title: computed(() => t('locale.date_modified')).value,
      visible: width.value > breakPoint.brTablet,
      width: '220',
    },
    {
      key: 'size',
      title: computed(() => t('locale.file_size')).value,
      visible: width.value > breakPoint.brTablet,
      width: '160',
    },
    {
      key: 'path',
      title: computed(() => t('locale.location')).value,
      visible: width.value > breakPoint.brTablet,
      width: '250',
    },
    {
      key: 'groupActions',
      title: '',
      visible: true,
      align: 'end',
      width: width.value > breakPoint.brSpLandscape ? '160' : '100',
    },
  ],
};
