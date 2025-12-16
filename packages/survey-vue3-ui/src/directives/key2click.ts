import {
  doKey2ClickBlur,
  doKey2ClickDown,
  doKey2ClickUp,
  type IAttachKey2clickOptions,
} from "survey-core";
import type { ObjectDirective } from "vue";

export const key2ClickDirective: ObjectDirective<any, IAttachKey2clickOptions> =
  {
    mounted: function (el: HTMLElement, binding) {
      const options: IAttachKey2clickOptions = Object.assign(
        {
          processEsc: true,
        },
        { ...binding.value }
      );
      if (options.disableTabStop) {
        el.tabIndex = -1;
        return;
      }
      if (!options.disableTabStop) el.tabIndex = 0;
      el.addEventListener("pointerup", (evt: any) => {
        if (evt.pointerType === "pen") {
          evt.preventDefault();
          evt.stopPropagation();
          const element: any = evt.target;
          if (element?.click) element.click();
          return false;
        }
      });
      el.addEventListener("keyup", (evt: any) => {
        evt.preventDefault();
        evt.stopPropagation();
        doKey2ClickUp(evt, options);
        return false;
      });
      el.addEventListener("keydown", (evt: any) => {
        doKey2ClickDown(evt, options);
      });
      el.addEventListener("blur", (evt: any) => {
        doKey2ClickBlur(evt);
      });
    },
  };
