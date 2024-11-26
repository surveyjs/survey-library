import { renamedIcons } from "./utils/utils";
import { DomDocumentHelper } from "./global_variables_utils";
import { EventBase } from "./base";

interface SvgIconData {
  [key: string]: string;
}

export class SvgIconRegistry {
  icons: SvgIconData = {};
  private iconPrefix = "icon-";

  private processId(iconId: string, iconPrefix: string) {
    if (iconId.indexOf(iconPrefix) == 0) {
      iconId = iconId.substring(iconPrefix.length);
    }
    iconId = renamedIcons[iconId] || iconId;
    return iconId;
  }
  public registerIconFromSymbol(iconId: string, iconSymbolSvg: string) {
    this.icons[iconId] = iconSymbolSvg;
  }
  public registerIconFromSvgViaElement(iconId: string, iconSvg: string, iconPrefix: string = this.iconPrefix): void {
    if (!DomDocumentHelper.isAvailable()) return;
    iconId = this.processId(iconId, iconPrefix);
    let divSvg = DomDocumentHelper.createElement("div");
    divSvg.innerHTML = iconSvg;
    let symbol = DomDocumentHelper.createElement("symbol");
    let svg = divSvg.querySelector("svg");
    symbol.innerHTML = svg.innerHTML;

    for (var i = 0; i < svg.attributes.length; i++) {
      symbol.setAttributeNS("http://www.w3.org/2000/svg", svg.attributes[i].name, svg.attributes[i].value);
    }
    symbol.id = iconPrefix + iconId;

    this.registerIconFromSymbol(iconId, symbol.outerHTML);
  }
  public registerIconFromSvg(iconId: string, iconSvg: string, iconPrefix: string = this.iconPrefix): boolean {
    iconId = this.processId(iconId, iconPrefix);
    const startStr = "<svg ";
    const endStr = "</svg>";
    iconSvg = iconSvg.trim();
    const str = iconSvg.toLowerCase();

    if (str.substring(0, startStr.length) === startStr &&
      str.substring(str.length - endStr.length, str.length) === endStr) {
      this.registerIconFromSymbol(iconId, "<symbol " +
        "id=\"" + iconPrefix + iconId + "\" " +
        iconSvg.substring(startStr.length, str.length - endStr.length) +
        "</symbol>");
      return true;
    }
    else {
      return false;
    }

  }
  // TODO: remove in V2
  public registerIconsFromFolder(r: any): void {
    r.keys().forEach((key: string) => {
      this.registerIconFromSvg(key.substring(2, key.length - 4).toLowerCase(), r(key));
    });
  }
  public registerIcons(icons: SvgIconData): void {
    for (const iconId in icons) {
      this.registerIconFromSvg(iconId, icons[iconId]);
    }
    this.updateMarkup();
  }
  public iconsRenderedHtml(): string {
    return Object.keys(this.icons).map(icon => this.icons[icon]).join("");
  }
  public updateMarkup(): void {
    this.onIconsChanged.fire(this, {});
  }
  public onIconsChanged = new EventBase<SvgIconRegistry, {}>()
}

export const SvgRegistry: SvgIconRegistry = new SvgIconRegistry();
export const SvgThemeSets: { [index: string]: SvgIconData } = {};

export function addIconsToThemeSet(name: string, iconsData: SvgIconData): void {
  if(!SvgThemeSets[name]) {
    SvgThemeSets[name] = {};
  }
  const set = SvgThemeSets[name];
  for (const iconId in iconsData) {
    set[iconId] = iconsData[iconId];
  }
}
