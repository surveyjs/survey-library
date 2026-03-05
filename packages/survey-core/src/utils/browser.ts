import { DomWindowHelper } from "../global_variables_utils";

export function detectIEBrowser(): boolean {
  const ua: string = navigator.userAgent;
  const oldIe: number = ua.indexOf("MSIE ");
  const elevenIe: number = ua.indexOf("Trident/");
  return oldIe > -1 || elevenIe > -1;
}

export function detectIEOrEdge(): boolean {
  if (typeof (<any>detectIEOrEdge).isIEOrEdge === "undefined") {
    const ua: string = navigator.userAgent;
    const msie: number = ua.indexOf("MSIE ");
    const trident: number = ua.indexOf("Trident/");
    const edge: number = ua.indexOf("Edge/");
    (<any>detectIEOrEdge).isIEOrEdge = edge > 0 || trident > 0 || msie > 0;
  }
  return (<any>detectIEOrEdge).isIEOrEdge;
}

export function isMobile(): boolean {
  return (DomWindowHelper.isAvailable() && DomWindowHelper.hasOwn("orientation"));
}
