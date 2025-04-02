// Utility Functions
import { IFileManager } from '@/interfaces/IFileManager';
import { actionGetMimeType } from '@/utils/MyFunction';
import { FileExtensions, mimeType } from '@/utils/MyVariables';

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
  // const publicPath = env.publicPath;
  const iconBasePath = `/assets/icons/office`;

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

export const getNearestFolder = (path: string): string => {
  // Tách chuỗi theo dấu '/' và loại bỏ các phần rỗng
  const parts = path.split('/').filter((part) => part.trim() !== '');
  return parts.length > 1 ? parts[parts.length - 2] : '';
};
