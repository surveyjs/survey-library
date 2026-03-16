export interface IAttachKey2clickOptions {
  processEsc?: boolean;
  disableTabStop?: boolean;
  __keyDownReceived?: boolean;
}

const keyFocusedClassName = "sv-focused--by-key";

export function doKey2ClickBlur(evt: KeyboardEvent): void {
  const element: any = evt.target;
  if (!element || !element.classList) return;
  element.classList.remove(keyFocusedClassName);
}

export function doKey2ClickUp(evt: KeyboardEvent, options?: IAttachKey2clickOptions): void {
  if (!!evt.target && (<any>evt.target)["contentEditable"] === "true") {
    return;
  }
  const element: any = evt.target;
  if (!element) return;
  const char: number = evt.which || evt.keyCode;
  if (char === 9) {
    if (!!element.classList && !element.classList.contains(keyFocusedClassName)) {
      element.classList.add(keyFocusedClassName);
    }
    return;
  }

  if (options) {
    if (!options.__keyDownReceived) return;
    options.__keyDownReceived = false;
  }

  if (char === 13 || char === 32) {
    if (element.click) element.click();
  } else if ((!options || options.processEsc) && char === 27) {
    if (element.blur) element.blur();
  }
}

export function doKey2ClickDown(evt: KeyboardEvent, options: IAttachKey2clickOptions = { processEsc: true }): void {
  if (options) options.__keyDownReceived = true;
  if (!!evt.target && (<any>evt.target)["contentEditable"] === "true") {
    return;
  }
  var char = evt.which || evt.keyCode;
  const supportedCodes = [13, 32];
  if (options.processEsc) {
    supportedCodes.push(27);
  }
  if (supportedCodes.indexOf(char) !== -1) {
    evt.preventDefault();
  }
}
