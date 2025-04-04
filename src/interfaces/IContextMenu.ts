export interface IContextMenuSubMenu {
  key: string;
  title: string;
  visible: boolean;
  icon?: string;
  subMenus?: IContextMenuSubMenu[];
  disabled?: boolean;
}

export interface IContextMenu {
  key: string;
  title: string;
  visible: boolean;
  icon?: string;
  subMenus?: IContextMenuSubMenu[];
  disabled?: boolean;
}
