// Utility Functions
import { IRequestDataDto } from '@/interfaces/dto/IRequestDataDto';
import { IFileManager } from '@/interfaces/IFileManager';
import { FileManagerShareStore } from '@/stores/user/file-manager-share-store';
import { FileManagerStore } from '@/stores/user/file-manager-store';
import { EnumActionFileManager, EnumFMType, EnumOpenTool, EnumShareFilePermission } from '@/utils/my-enum';
import { actionGetMimeType, handleErrorResponse, showToastMessage } from '@/utils/my-function';
import { myRoute } from '@/utils/my-route';
import { baseUrl, env, FileExtensions, mimeType } from '@/utils/my-variables';

// API Data Fetching
export async function fileManagerGetItems(request: Ref<IRequestDataDto>, fmType: Ref<EnumFMType>) {
  const fileManagerStore = FileManagerStore();
  const fileManagerShareStore = FileManagerShareStore();

  // init request
  const defaultRequest = {
    data: request.value.data,
  } as IRequestDataDto;
  // Computed property để cache lại function mapping
  const actionMap = computed(() => ({
    [EnumFMType.trash]: () => fileManagerStore.actionGetFileTrashList(defaultRequest),
    [EnumFMType.tag]: () => fileManagerStore.actionGetFileTagList(defaultRequest),
    [EnumFMType.search]: () => fileManagerStore.actionSearchFile(defaultRequest),
    [EnumFMType.my_files]: () => fileManagerStore.actionGetFileList(defaultRequest),
    [EnumFMType.share_by_me]: () => fileManagerShareStore.actionListShareFileByMe(defaultRequest),
    [EnumFMType.share_with_me]: () => fileManagerShareStore.actionListShareFileWithMe(defaultRequest),
    [EnumFMType.share_public]: () => fileManagerShareStore.actionListShareFilePublic(defaultRequest),
  }));

  let response: any | null = null;

  try {
    // Get appropriate action based on fmType
    const action = actionMap.value[fmType.value];
    if (!action) {
      showToastMessage(`Invalid file manager type: ${fmType.value}`, true);
    }

    // Execute action
    response = await action();

    // Update pagination if available
    if (response?.nextObject || response?.nextNumber) {
      (request.value.data as IFileManager).start_after_path = response.nextObject;
      (request.value.data as IFileManager).start_number_mongo = response.nextNumber;
    }

    return response ?? [];
  } catch (error) {
    console.error('File manager error:', error);
    showToastMessage(handleErrorResponse(error), true);
    return [];
  }
}

export function fileManagerGenerateNewPath(
  isDirectory: boolean,
  originalName: string,
  currentPath: string,
  newName: string,
): string {
  // Loại bỏ dấu "/" ở cuối nếu có
  const trimmedPath = currentPath.endsWith('/') ? currentPath.slice(0, -1) : currentPath;

  // Nếu `originalName` trùng với `trimmedPath`, trả về `newName` với định dạng tùy thuộc vào loại
  if (originalName === trimmedPath) {
    return isDirectory ? `${newName}/` : newName;
  }

  // Tìm `newPath` bằng cách cắt `currentPath` đến dấu "/" cuối cùng
  const lastSlashIndex = trimmedPath.lastIndexOf('/');
  const newPath = trimmedPath.slice(0, lastSlashIndex);

  // Trả về đường dẫn mới với định dạng tùy thuộc vào loại (thư mục hoặc tệp)
  return `${newPath}/${newName}${isDirectory ? '/' : ''}`;
}

export function getThumbnailIcon(item: IFileManager) {
  const type = item.type;
  const mimeTypeValue = actionGetMimeType(item.type);
  const publicPath = env.publicPath;
  const iconBasePath = `${publicPath}/assets/icons/office`;

  // Hàm phụ trợ để trả về đường dẫn icon
  const getIconPath = (iconName: string) => `${iconBasePath}/${iconName}`;

  // Trường hợp thư mục hoặc type không xác định
  if (item.isDirectory) {
    return getIconPath('folder.svg');
  }

  // Bản đồ icon mở rộng
  const iconMap: Record<string, string> = {
    svg: 'svg.svg',
    doc: 'docx.svg',
    docx: 'docx.svg',
    slx: 'excel.svg',
    xlsx: 'xlsx.svg',
    csv: 'csv.svg',
    xml: 'xml.svg',
    html: 'html.svg',
    one: 'one.svg',
    sql: 'sql.svg',
    log: 'log.svg',
    iso: 'iso.svg',
    apk: 'apk.svg',
    dmg: 'dmg.svg',
    exe: 'exe.svg',
    pdf: 'pdf.svg',
    pptx: 'pptx.svg',
    accdb: 'accdb.svg',
    cmd: 'cmd.svg',
    jar: 'jar.svg',
    json: 'json.svg',
    ovpn: 'ovpn.svg',
    psd: 'psd.svg',
    // Thêm các nhóm mở rộng vào iconMap
    ...FileExtensions.IMAGE.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'photo.svg',
      }),
      {},
    ),
    ...FileExtensions.ZIP.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'zip.svg',
      }),
      {},
    ),
    ...FileExtensions.AUDIO.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'audio.svg',
      }),
      {},
    ),
    ...FileExtensions.CODE.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'code.svg',
      }),
      {},
    ),
    ...FileExtensions.VISIO.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'vsdx.svg',
      }),
      {},
    ),
    ...FileExtensions.TXT.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'txt.svg',
      }),
      {},
    ),
    ...FileExtensions.MSPUBLISHER.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'pub.svg',
      }),
      {},
    ),
    ...FileExtensions.MSPROJECT.reduce(
      (acc, ext) => ({
        ...acc,
        [ext]: 'mpp.svg',
      }),
      {},
    ),
  };

  // Kiểm tra mime type cho video trước, sau đó kiểm tra iconMap
  if (mimeType.VIDEO.includes(mimeTypeValue) || FileExtensions.VIDEO.includes(type)) {
    return getIconPath('video.svg');
  }

  // Nếu type có trong iconMap, trả về icon tương ứng
  if (iconMap[type]) {
    return getIconPath(iconMap[type]);
  }

  // Mặc định cho file không xác định
  return getIconPath('genericfile.svg');
}

export async function openFileWithTool(tool: string, objectSelectedOne: IFileManager) {
  console.log(objectSelectedOne);
  objectSelectedOne.tool_open = tool;
  if (tool === EnumOpenTool.office) {
    const newUrl = `${handleQueryAccessFile(`${baseUrl}${myRoute.office}`, objectSelectedOne)}`;
    window.open(newUrl, '_blank');
  } else {
    const newUrl = `${handleQueryAccessFile(`${baseUrl}${myRoute.open}`, objectSelectedOne)}`;
    window.open(newUrl, '_blank');
  }
}

export const hasPermissionByAction = (action: EnumActionFileManager, permission: EnumShareFilePermission) => {
  const permissionView = [
    EnumActionFileManager.detail,
    EnumActionFileManager.download_custom,
    EnumActionFileManager.open_custom,
    EnumActionFileManager.open_with,
    EnumActionFileManager.open_with_image,
    EnumActionFileManager.open_with_new_tab,
    EnumActionFileManager.open_with_office,
    EnumActionFileManager.open_with_pdf,
    EnumActionFileManager.open_with_video,
    EnumActionFileManager.open_with_word,
    EnumActionFileManager.preview,
  ];

  const permissionEdit = [EnumActionFileManager.rename_custom, EnumActionFileManager.put_content_custom];

  const permissionFullControl = [
    EnumActionFileManager.assign_tag_custom,
    EnumActionFileManager.delete_custom,
    EnumActionFileManager.delete_share_custom,
    EnumActionFileManager.remove_tag_custom,
    EnumActionFileManager.restore_trash_custom,
    EnumActionFileManager.share_with_custom,
    EnumActionFileManager.share_user,
    EnumActionFileManager.share_group,
    EnumActionFileManager.move_trash_custom,
    EnumActionFileManager.copy_to_custom,
    EnumActionFileManager.move_to_custom,
    EnumActionFileManager.copy_link,
    EnumActionFileManager.upload_custom,
  ];

  if (permission === EnumShareFilePermission.view) {
    return permissionView.includes(action);
  } else if (permission === EnumShareFilePermission.edit) {
    return [...permissionView, ...permissionEdit].includes(action);
  } else if (permission === EnumShareFilePermission.full_control) {
    return [...permissionView, ...permissionEdit, ...permissionFullControl].includes(action);
  } else {
    return false;
  }
};

export const handleQueryAccessFile = (path: string, item: IFileManager) => {
  let query = '';
  if (item.share_id) query += `share_id=${item.share_id}`;
  if (item.path) query += `&path=${item.path.split('/').map(encodeURIComponent).join('/')}`;
  if (item.tool_open) query += `&tool_open=${item.tool_open}`;
  // if (item.type) query += `&type=${item.type}`;
  return `${path}?${query}`;
};

export const getNearestFolder = (path: string): string => {
  // Tách chuỗi theo dấu '/' và loại bỏ các phần rỗng
  const parts = path.split('/').filter((part) => part.trim() !== '');
  return parts.length > 1 ? parts[parts.length - 2] : '';
};
