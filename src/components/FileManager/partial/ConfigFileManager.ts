import { t } from '@/plugins/i18n';

export const columnsDefault = [
  {
    key: 'name',
    title: computed(() => t('locale.backend_data_name')),
    visible: true,
    width: 'auto',
  },
  {
    key: 'owner',
    title: computed(() => t('locale.owner')),
    visible: true,
    width: '200',
  },
  {
    key: 'lastModified',
    title: computed(() => t('locale.date_modified')),
    visible: true,
    width: '220',
  },
  {
    key: 'size',
    title: computed(() => t('locale.file_size')),
    visible: true,
    width: '160',
  },
  {
    key: 'groupActions',
    title: '',
    visible: true,
    align: 'end',
    width: 'auto',
  },
];
