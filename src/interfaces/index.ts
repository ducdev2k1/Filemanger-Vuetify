export interface IColumnFileManger {
  key: string;
  title: string;
  align?: '' | 'center' | 'left' | 'end' | 'right' | 'start';
  width: number | string;
  visible: boolean;
}

export interface ISingleModeSelect {}
