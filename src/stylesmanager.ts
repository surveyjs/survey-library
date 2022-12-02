import { surveyCss } from "./defaultCss/defaultV2Css";
import { Logger } from "./utils/utils";
export class StylesManager {
  private static SurveyJSStylesSheetId = "surveyjs-styles";
  private sheet: CSSStyleSheet = null;

  public static Logger: Logger;
  public static Styles: { [key: string]: string } = {};
  public static Media: { [key: string]: { media: string, style: string } } = { };
  public static ThemeColors: { [key: string]: { [key: string]: string } } = { };
  public static ThemeCss: { [key: string]: { [key: string]: string } } = { };
  public static ThemeSelector: { [key: string]: string } = { "default": ".sv_main" };

  static findSheet(styleSheetId: string): any {
    if (typeof document === "undefined") return null;
    for (let i = 0; i < document.styleSheets.length; i++) {
      if (!!document.styleSheets[i].ownerNode && (<any>document).styleSheets[i].ownerNode["id"] === styleSheetId) {
        return <CSSStyleSheet>document.styleSheets[i];
      }
    }
    return null;
  }

  static createSheet(styleSheetId: string): any {
    let style = document.createElement("style");
    style.id = styleSheetId;
    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    if (!!StylesManager.Logger) {
      StylesManager.Logger.log("style sheet " + styleSheetId + " created");
    }
    return <CSSStyleSheet>style.sheet;
  }

  public static applyTheme(themeName: string = "default", themeSelector?: string): void {
    surveyCss.currentType = themeName;
    // const themeCssRules = StylesManager.ThemeCss[themeName + "ThemeCss"];
    const currentThemeSelector = themeSelector || StylesManager.ThemeSelector[themeName] || StylesManager.ThemeSelector["default"];
    const themeCss = StylesManager.ThemeCss[themeName];

    if(!themeCss) {
      surveyCss.currentType = "defaultV2";
      return;
    }

    if (StylesManager.Enabled) {
      const styleSheetId = (themeName + currentThemeSelector).trim();
      let sheet = StylesManager.findSheet(styleSheetId);
      if (!sheet) {
        sheet = StylesManager.createSheet(styleSheetId);
        const themeColors = StylesManager.ThemeColors[themeName] || StylesManager.ThemeColors["default"];

        Object.keys(themeCss).forEach((selector) => {
          let cssRuleText = themeCss[selector];
          Object.keys(themeColors || {}).forEach(
            (colorVariableName) => (cssRuleText = cssRuleText.replace(new RegExp("\\" + colorVariableName, "g"), themeColors[colorVariableName]))
          );
          try {
            if (selector.indexOf("body") === 0) {
              sheet.insertRule(selector + " { " + cssRuleText + " }", 0);
            } else {
              sheet.insertRule(currentThemeSelector + selector + " { " + cssRuleText + " }", 0);
            }
          } catch (e) { }
        });
      }
    }

    if (!!StylesManager.Logger) {
      StylesManager.Logger.log("apply theme " + themeName + " completed");
    }
  }

  public static Enabled = true;

  constructor() {
    if (StylesManager.Enabled) {
      this.sheet = StylesManager.findSheet(StylesManager.SurveyJSStylesSheetId);
      if (!this.sheet) {
        this.sheet = StylesManager.createSheet(StylesManager.SurveyJSStylesSheetId);
        this.initializeStyles(this.sheet);
      }
    }
  }

  public initializeStyles(sheet: CSSStyleSheet): any {
    if (StylesManager.Enabled) {
      if(Object.keys(StylesManager.Styles).length) {
        Object.keys(StylesManager.Styles).forEach((selector) => {
          try {
            sheet.insertRule(selector + " { " + StylesManager.Styles[selector] + " }", 0);
          } catch (e) { }
        });
      }
      if(Object.keys(StylesManager.Media).length) {
        Object.keys(StylesManager.Media).forEach((selector) => {
          try {
            sheet.insertRule(
              StylesManager.Media[selector].media +
            " { " +
            selector +
            " { " +
            StylesManager.Media[selector].style +
            " } }",
              0
            );
          } catch (e) { }
        });
      }
    }
  }
}
