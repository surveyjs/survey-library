import * as React from "react";
import { doKey2ClickUp, doKey2ClickBlur, doKey2ClickDown, IAttachKey2clickOptions } from "survey-core";

export function attachKey2click(element: React.JSX.Element, viewModel?: any, options: IAttachKey2clickOptions = { processEsc: true, disableTabStop: false }): React.JSX.Element {
  let props = {};
  if ((!!viewModel && viewModel.disableTabStop) || (!!options && options.disableTabStop)) {
    props = { tabIndex: -1 };
  } else {
    options = { ...options };
    props = {
      tabIndex: 0,
      onKeyUp: (evt: KeyboardEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        doKey2ClickUp(evt, options);
      },
      onKeyDown: (evt: any) => doKey2ClickDown(evt, options),
      onBlur: (evt: any) => doKey2ClickBlur(evt),
    };
  }
  props["onPointerUp"] = (evt: PointerEvent) => {
    if (evt.pointerType === "pen") {
      evt.preventDefault();
      evt.stopPropagation();
      const element: any = evt.target;
      if (element?.click) element.click();
    }
  };
  return React.cloneElement(element, props);
}
