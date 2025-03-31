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

// convert bytes to KB, MB, GB
export function convertBytes(num: number): string | number {
  if (num === -1 || num === undefined) {
    return -1;
  } else if (num < 1024) {
    return `${num.toFixed(2)} bytes`;
  } else if (num === 0) {
    return 0;
  }

  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;
  const terabyte = gigabyte * 1024;

  if (num >= terabyte) {
    const result = num / terabyte;
    return Number.isInteger(result) ? `${result} TB` : `${result.toFixed(2)} TB`;
  } else if (num >= gigabyte) {
    const result = num / gigabyte;
    return Number.isInteger(result) ? `${result} GB` : `${result.toFixed(2)} GB`;
  } else if (num >= megabyte) {
    const result = num / megabyte;
    return Number.isInteger(result) ? `${result} MB` : `${result.toFixed(2)} MB`;
  } else if (num >= kilobyte) {
    const result = num / kilobyte;
    return Number.isInteger(result) ? `${result} KB` : `${result.toFixed(2)} KB`;
  }

  return `${num} bytes`;
}
