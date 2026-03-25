import { DomWindowHelper } from "../global_variables_utils";

export function loadFileFromBase64(b64Data: string, fileName: string): void {
  try {
    const byteString: string = atob(b64Data.split(",")[1]);

    const mimeString: string = b64Data
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];

    const ab: ArrayBuffer = new ArrayBuffer(byteString.length);
    const ia: Uint8Array = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const bb: Blob = new Blob([ab], { type: mimeString });
    if (!!navigator && (<any>navigator)["msSaveBlob"]) {
      (<any>navigator)["msSaveOrOpenBlob"](bb, fileName);
    }
  } catch(err) { }
}

export function chooseFiles(input: HTMLInputElement, callback: (files: File[]) => void): void {
  if (!DomWindowHelper.isFileReaderAvailable()) return;
  input.value = "";
  input.onchange = (event) => {
    if (!DomWindowHelper.isFileReaderAvailable()) return;
    if (!input || !input.files || input.files.length < 1) return;
    let files = [];
    for (let i = 0; i < input.files.length; i++) {
      files.push(input.files[i]);
    }
    callback(files);
  };
  input.click();
}
