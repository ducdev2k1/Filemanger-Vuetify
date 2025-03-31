import { IFileManagerSharedWith } from '@/interfaces/IFileManagerShare';
import { ITag } from '@/interfaces/ITag';
import {
  EnumActionFileManager,
  EnumShareFilePermission,
  EnumShareFileType,
  EnumStatusModel,
  EnumStatusUploadFile,
} from '@/utils/MyEnum';

export interface IFileManager {
  key: string; // selected key - client only
  share_id: string; // mongo share only
  name: string; // devextreme + s3 required
  path: string; // devextreme + s3 required
  size: number; // devextreme + s3 required
  isDirectory: boolean; // devextreme + mongo required
  status: EnumStatusModel; // mongo required
  time_deleted: string; // mongo required
  domain: string; // mongo required
  type: string; // s3 required
  lastModified: Date; // s3 required
  etag: string; // s3 required
  mime_type: string;
  force_action: boolean; // force action nao do ma ko can validate - client only
  old_path: string; // dung cho rename file/folder - client only
  data: File; // data binary for upload file - client only
  upload_id: string; // danh cho multipart upload - client only
  chunkSize: number;
  maxChunkSize: number;
  isLargeFile: boolean; // Kiem tra file TO hay file nho de goi api khac nhau - client only
  lastUploadedChunk: number; // Save the current chunk index - client only
  uploadProgress: number; // tien trinh upload file - client only
  uploadedSize: number; // size da upload file - client only
  uploadStatus: EnumStatusUploadFile; // tien trinh upload file - client only
  uploadMessage: string; // noi dung upload file error/success - client only
  uploadRemainingTime: string; // tính toán thời gian còn lại - client only
  uploadSpeed: number; // Tính tốc độ upload cho chunk (MB or KB/s) - client only
  loading: boolean;
  tags: ITag[];
  owner: IFileManagerSharedWith; // dung cho render - client only (hien thi o share with me)
  share: IFileManagerSharedWith[]; // dung cho render - client only (hien thi o my files, share by me)
  paths: string[]; // dung cho tag request - client only
  tag_id: string; // dung cho tag request - client only
  permission: EnumShareFilePermission; // dung cho find response - client only
  account_request: string; // client only
  share_type: EnumShareFileType; // client only
  share_access_directory: boolean; // client only
  meta_uuid: string; // client only
  tool_open: string; // client only
  content_recommend: string; // client only
  action: EnumActionFileManager; // client only
  createdAt: Date; // client only
  page_size: number; // client only
  start_after_path: string; // client only - dung trong list ben s3
  start_number_mongo: number; // client only - dung trong list ben mongo
  imageUrl: string; // dung cho render - client only
  children: IFileManager[]; // client only - treeview select folder when copy/move
  disabled: boolean; // client only - treeview state folder when copy/move
  hidden: boolean; // client only - dung cho uploading
  full_path: string; // client only - duong dan day du chu yeu dung cho init upload
}
