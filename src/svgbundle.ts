class SvgIconData {
  [key: string]: string
}
export class SvgIconRegistry {
  icons: SvgIconData = {};
  private iconPrefix = "icon-";

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
      symbol.setAttribute(svg.attributes[i].name, svg.attributes[i].value);
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
              str.substring(startStr.length, str.length - endStr.length) +
              "</symbol>");
      return true;
    }
    else{
      return false;
    }

  }
  public iconsRenderedHtml() {
    return Object.keys(this.icons).map(icon => this.icons[icon]).join("");
  }
  public renderIcons() {
    const containerId = "sv-icon-holder-global-container";
    if(!document.getElementById(containerId)) {
      let iconsDiv = document.createElement("div");
      document.head.insertBefore(iconsDiv, document.head.firstChild);
      iconsDiv.id = containerId;
      iconsDiv.style.display = "none";
      iconsDiv.innerHTML = "<svg>" + this.iconsRenderedHtml() + "</svg>";
    }
  }
}
export var SvgRegistry: SvgIconRegistry = new SvgIconRegistry();
export var SvgBundleViewModel: any;

if (!!(<any>global).document) {
  var svgTemplate = require("html-loader?interpolate!val-loader!./svgbundle.html");
  var templateHolder = document.createElement("div");
  templateHolder.style.display = "none";
  templateHolder.innerHTML = svgTemplate;
  document.head.appendChild(templateHolder);
}
