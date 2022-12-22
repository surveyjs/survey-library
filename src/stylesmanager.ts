import { surveyCss } from "./defaultCss/defaultV2Css";
import { Logger } from "./utils/utils";

export const modernThemeColors: { [key: string]: string } = {
  "$main-color": "#1ab394",
  "$add-button-color": "#1948b3",
  "$remove-button-color": "#ff1800",
  "$disable-color": "#dbdbdb",
  "$progress-text-color": "#9d9d9d",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-slider-color": "#cfcfcf",
  "$error-color": "#d52901",
  "$text-color": "#404040",
  "$light-text-color": "#fff",
  "$checkmark-color": "#fff",
  "$progress-buttons-color": "#8dd9ca",
  "$inputs-background-color": "transparent",
  "$main-hover-color": "#9f9f9f",
  "$body-container-background-color": "#f4f4f4",
  "$text-border-color": "#d4d4d4",
  "$disabled-text-color": "rgba(64, 64, 64, 0.5)",
  "$border-color": "rgb(64, 64, 64, 0.5)",
  "$header-background-color": "#e7e7e7",
  "$answer-background-color": "rgba(26, 179, 148, 0.2)",
  "$error-background-color": "rgba(213, 41, 1, 0.2)",
  "$radio-checked-color": "#404040",
  "$clean-button-color": "#1948b3",
  "$body-background-color": "#ffffff",
  "$foreground-light": "#909090",
};

function setCssVariables(vars: { [key: string]: string }, element: HTMLElement): void {
  Object.keys(vars || {}).forEach(sassVarName => {
    const name = sassVarName.substring(1);
    element.style.setProperty("--" + name, vars[sassVarName]);
  });
}

export class StylesManager {
  private static SurveyJSStylesSheetId = "surveyjs-styles";
  private sheet: CSSStyleSheet = null;

  public static Logger: Logger;
  public static Styles: { [key: string]: string } = {};
  public static Media: { [key: string]: { media: string, style: string } } = { };
  public static ThemeColors: { [key: string]: { [key: string]: string } } = {
    "modern": modernThemeColors
  };
  public static ThemeCss: { [key: string]: { [key: string]: string } } = { };
  public static ThemeSelector: { [key: string]: string } = {
    "default": ".sv_main ",
    "modern": ".sv-root-modern "
  };

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

      if(themeName === "modern") {
        setCssVariables(StylesManager.ThemeColors[themeName], document.body);
        return;
      }

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
