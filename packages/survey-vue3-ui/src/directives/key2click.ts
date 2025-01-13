import {
  doKey2ClickBlur,
  doKey2ClickDown,
  doKey2ClickUp,
  IAttachKey2clickOptions,
} from "survey-core";
import type { ObjectDirective } from "vue";

export const key2ClickDirective: ObjectDirective<any, IAttachKey2clickOptions> =
  {
    mounted: function (el: HTMLElement, binding) {
      const options: IAttachKey2clickOptions = { ...binding.value } || {
        processEsc: true,
      };
      if (options.disableTabStop) {
        el.tabIndex = -1;
        return;
      }
      if (!options.disableTabStop) el.tabIndex = 0;
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
