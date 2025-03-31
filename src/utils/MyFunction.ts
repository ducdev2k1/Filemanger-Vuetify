export function addEventKeyDown(keydownHandler: (event: KeyboardEvent) => void) {
  window.addEventListener('keydown', (event) => {
    const editableElements = ['INPUT', 'TEXTAREA'];
    const activeElement = document.activeElement as HTMLElement;

    if (activeElement && (editableElements.includes(activeElement.tagName) || activeElement.isContentEditable)) {
      return;
    }
    keydownHandler(event);
  });
}

// Lấy chữ cái đầu từ fullName
export function initialsByFullName(fullName: string) {
  let name: string;
  const nameParts = fullName.trim().split(' ');
  if (nameParts.length > 2) {
    name = nameParts[1][0] + nameParts[2][0];
  } else if (nameParts.length > 1) {
    name = nameParts[0][0] + nameParts[1][0];
  } else {
    name = nameParts[0].substring(0, 2);
  }

  return name.toUpperCase();
}

// // path public or private file image
// export const publicPathImage = (pathPublic: any, file: IFileManager) => {
//   if (mimeType.IMAGE.includes(file.mime_type)) {
//     const urlPublic = `${window.location.origin}/api/v1/user-fm-open-share-file-public`;
//     const urlPrivate = `${window.location.origin}/api/v1/user-fm-open-file`;
//     return handleQueryAccessFile(pathPublic ? urlPublic : urlPrivate, file);
//   } else {
//     return getThumbnailIcon(file);
//   }
// };
