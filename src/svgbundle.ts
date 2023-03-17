import { ISurveyEnvironment } from "./base-interfaces";
import { settings } from "./settings";
import { getElement } from "./utils/utils";

class SvgIconData {
  [key: string]: string
}
export class SvgIconRegistry {
  icons: SvgIconData = {};
  private iconPrefix = "icon-";
  private environment: ISurveyEnvironment = settings.environment;

  public registerIconFromSymbol(iconId: string, iconSymbolSvg: string) {
    this.icons[iconId] = iconSymbolSvg;
  }
  public registerIconFromSvgViaElement(iconId: string, iconSvg: string, iconPrefix: string = this.iconPrefix) {
    let divSvg = document.createElement("div");
    divSvg.innerHTML = iconSvg;
    let symbol = document.createElement("symbol");
    let svg = divSvg.querySelector("svg");
    symbol.innerHTML = svg.innerHTML;

    for (var i = 0; i < svg.attributes.length; i++) {
      symbol.setAttributeNS("http://www.w3.org/2000/svg", svg.attributes[i].name, svg.attributes[i].value);
    }
    symbol.id = iconPrefix + iconId;

    this.registerIconFromSymbol(iconId, symbol.outerHTML);
  }
  public registerIconFromSvg(iconId: string, iconSvg: string, iconPrefix: string = this.iconPrefix): boolean {
    const startStr = "<svg ";
    const endStr = "</svg>";
    iconSvg = iconSvg.trim();
    const str = iconSvg.toLowerCase();

    if(str.substring(0, startStr.length) === startStr &&
       str.substring(str.length - endStr.length, str.length) === endStr) {
      this.registerIconFromSymbol(iconId, "<symbol " +
              "id=\"" + iconPrefix + iconId + "\" " +
              iconSvg.substring(startStr.length, str.length - endStr.length) +
              "</symbol>");
      return true;
    }
    else{
      return false;
    }

  }
  public registerIconsFromFolder(r: any) {
    r.keys().forEach((key: string) => {
      this.registerIconFromSvg(key.substring(2, key.length - 4).toLowerCase(), r(key));
    });
  }
  public iconsRenderedHtml() {
    return Object.keys(this.icons).map(icon => this.icons[icon]).join("");
  }
  public renderIcons() {
    const containerId = "sv-icon-holder-global-container";
    if(!this.environment.root.getElementById(containerId)) {
      let iconsDiv = document.createElement("div");
      iconsDiv.id = containerId;
      iconsDiv.innerHTML = "<svg>" + this.iconsRenderedHtml() + "</svg>";
      iconsDiv.style.display = "none";

      getElement(this.environment.svgMountContainer).appendChild(iconsDiv);
    }
  }
}
export var SvgRegistry: SvgIconRegistry = new SvgIconRegistry();
export var SvgBundleViewModel: any;
const path = (<any>require).context("./images", false, /\.svg$/);

SvgRegistry.registerIconsFromFolder(path);
