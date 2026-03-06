import { DomDocumentHelper } from "../global_variables_utils";

export interface IVerticalDimensions {
  paddingTop: string;
  paddingBottom: string;
  marginTop: string;
  marginBottom: string;
  borderTopWidth: string;
  borderBottomWidth: string;
  heightFrom: string;
  heightTo: string;
}

export function getVerticalDimensions(el: HTMLElement): IVerticalDimensions {
  if (DomDocumentHelper.isAvailable()) {
    const { paddingTop, paddingBottom, borderTopWidth, borderBottomWidth, marginTop, marginBottom, boxSizing } = DomDocumentHelper.getComputedStyle(el);
    let heightTo = el.offsetHeight + "px";
    if (boxSizing == "content-box") {
      let heightPx = el.offsetHeight;
      [borderBottomWidth, borderTopWidth, paddingBottom, paddingTop].forEach((style) => {
        heightPx -= parseFloat(style);
      });
      heightTo = heightPx + "px";
    }
    return {
      paddingTop,
      paddingBottom,
      borderTopWidth,
      borderBottomWidth,
      marginTop,
      marginBottom,
      heightFrom: "0px",
      heightTo: heightTo
    };
  } else {
    return undefined;
  }
}

export function setPropertiesOnElementForAnimation(el: HTMLElement, styles: any, prefix: string = "--animation-"): void {
  (el as any)["__sv_created_properties"] = (el as any)["__sv_created_properties"] ?? [];
  Object.keys(styles).forEach((key) => {
    const propertyName = `${prefix}${key.split(/\.?(?=[A-Z])/).join("-").toLowerCase()}`;
    el.style.setProperty(propertyName, (styles as any)[key]);
    (el as any)["__sv_created_properties"].push(propertyName);
  });
}

export function prepareElementForVerticalAnimation(el: HTMLElement): void {
  setPropertiesOnElementForAnimation(el, getVerticalDimensions(el));
}

export function cleanHtmlElementAfterAnimation(el: HTMLElement): void {
  if (Array.isArray((el as any)["__sv_created_properties"])) {
    (el as any)["__sv_created_properties"].forEach((propertyName: string) => {
      el.style.removeProperty(propertyName);
    });
    delete (el as any)["__sv_created_properties"];
  }
}
