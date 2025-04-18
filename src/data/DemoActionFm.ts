import { MdiWebfont } from '@/components/Icons/mdi-font-icons';
import { IActionFM } from '@/interfaces';

export const DemoActionFM = [
  {
    key: 'download',
    visible: true,
    icon: MdiWebfont.download,
    disabled: false,
  },
  {
    key: 'rename',
    visible: true,
    icon: MdiWebfont.rename,
    disabled: false,
  },
  {
    key: 'coppy',
    visible: true,
    icon: MdiWebfont['content-copy'],
    disabled: false,
  },
  {
    key: 'move_to',
    visible: true,
    icon: MdiWebfont['folder-move'],
    disabled: false,
  },
  {
    key: 'delete',
    visible: true,
    icon: MdiWebfont.delete,
    disabled: false,
  },
] as IActionFM[];
