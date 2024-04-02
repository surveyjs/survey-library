import { surveyCss } from "./defaultCss/defaultV2Css";
import { DomDocumentHelper } from "./global_variables_utils";
import { settings, ISurveyEnvironment } from "./settings";
import { getElement, isShadowDOM, Logger } from "./utils/utils";

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
  "$font-family": "Raleway",
};
export const defaultThemeColors: { [key: string]: string } = {
  "$header-background-color": "#e7e7e7",
  "$body-container-background-color": "#f4f4f4",

  "$main-color": "#1ab394",
  "$main-hover-color": "#0aa384",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#6d7072",
  "$text-input-color": "#6d7072",
  "$header-color": "#6d7072",
  "$border-color": "#e7e7e7",

  "$error-color": "#ed5565",
  "$error-background-color": "#fcdfe2",

  "$progress-text-color": "#9d9d9d",
  "$disable-color": "#dbdbdb",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#8dd9ca",
  "$progress-buttons-line-color": "#d4d4d4"
};
export const orangeThemeColors: { [key: string]: string } = {
  "$header-background-color": "#4a4a4a",
  "$body-container-background-color": "#f8f8f8",

  "$main-color": "#f78119",
  "$main-hover-color": "#e77109",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#4a4a4a",
  "$text-input-color": "#4a4a4a",
  "$header-color": "#f78119",
  "$border-color": "#e7e7e7",

  "$error-color": "#ed5565",
  "$error-background-color": "#fcdfe2",

  "$progress-text-color": "#9d9d9d",
  "$disable-color": "#dbdbdb",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#f7b781",
  "$progress-buttons-line-color": "#d4d4d4"
};
export const darkblueThemeColors: { [key: string]: string } = {
  "$header-background-color": "#d9d8dd",
  "$body-container-background-color": "#f6f7f2",

  "$main-color": "#3c4f6d",
  "$main-hover-color": "#2c3f5d",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#4a4a4a",
  "$text-input-color": "#4a4a4a",
  "$header-color": "#6d7072",
  "$border-color": "#e7e7e7",

  "$error-color": "#ed5565",
  "$error-background-color": "#fcdfe2",

  "$progress-text-color": "#9d9d9d",
  "$disable-color": "#dbdbdb",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#839ec9",
  "$progress-buttons-line-color": "#d4d4d4"
};
export const darkroseThemeColors: { [key: string]: string } = {
  "$header-background-color": "#ddd2ce",
  "$body-container-background-color": "#f7efed",

  "$main-color": "#68656e",
  "$main-hover-color": "#58555e",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#4a4a4a",
  "$text-input-color": "#4a4a4a",
  "$header-color": "#6d7072",
  "$border-color": "#e7e7e7",

  "$error-color": "#ed5565",
  "$error-background-color": "#fcdfe2",

  "$progress-text-color": "#9d9d9d",
  "$disable-color": "#dbdbdb",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#c6bed4",
  "$progress-buttons-line-color": "#d4d4d4"
};
export const stoneThemeColors: { [key: string]: string } = {
  "$header-background-color": "#cdccd2",
  "$body-container-background-color": "#efedf4",

  "$main-color": "#0f0f33",
  "$main-hover-color": "#191955",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#0f0f33",
  "$text-input-color": "#0f0f33",
  "$header-color": "#0f0f33",
  "$border-color": "#e7e7e7",

  "$error-color": "#ed5565",
  "$error-background-color": "#fcdfe2",

  "$progress-text-color": "#9d9d9d",
  "$disable-color": "#dbdbdb",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#747491",
  "$progress-buttons-line-color": "#d4d4d4"
};
export const winterThemeColors: { [key: string]: string } = {
  "$header-background-color": "#82b8da",
  "$body-container-background-color": "#dae1e7",

  "$main-color": "#3c3b40",
  "$main-hover-color": "#1e1d20",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#000",
  "$text-input-color": "#000",
  "$header-color": "#000",
  "$border-color": "#e7e7e7",

  "$error-color": "#ed5565",
  "$error-background-color": "#fcdfe2",

  "$disable-color": "#dbdbdb",
  "$progress-text-color": "#9d9d9d",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#d1c9f5",
  "$progress-buttons-line-color": "#d4d4d4"
};
export const winterstoneThemeColors: { [key: string]: string } = {
  "$header-background-color": "#323232",
  "$body-container-background-color": "#f8f8f8",

  "$main-color": "#5ac8fa",
  "$main-hover-color": "#06a1e7",
  "$body-background-color": "white",
  "$inputs-background-color": "white",
  "$text-color": "#000",
  "$text-input-color": "#000",
  "$header-color": "#000",
  "$border-color": "#e7e7e7",

  "$error-color": "#ed5565",
  "$error-background-color": "#fcdfe2",

  "$disable-color": "#dbdbdb",
  "$progress-text-color": "#9d9d9d",
  "$disabled-label-color": "rgba(64, 64, 64, 0.5)",
  "$slider-color": "white",
  "$disabled-switch-color": "#9f9f9f",
  "$disabled-slider-color": "#cfcfcf",
  "$foreground-light": "#909090",
  "$foreground-disabled": "#161616",
  "$background-dim": "#f3f3f3",

  "$progress-buttons-color": "#acdcf2",
  "$progress-buttons-line-color": "#d4d4d4"
};

function setCssVariables(vars: { [key: string]: string }, element: HTMLElement): void {
  Object.keys(vars || {}).forEach(sassVarName => {
    const name = sassVarName.substring(1);
    element.style.setProperty("--" + name, vars[sassVarName]);
  });
}

export class StylesManager {
  private static SurveyJSStylesSheetId = "surveyjs-styles";

  public static Logger: Logger;
  public static Styles: { [key: string]: string } = {};
  public static Media: { [key: string]: { media: string, style: string } } = { };
  public static ThemeColors: { [key: string]: { [key: string]: string } } = {
    "modern": modernThemeColors,
    "default": defaultThemeColors,
    "orange": orangeThemeColors,
    "darkblue": darkblueThemeColors,
    "darkrose": darkroseThemeColors,
    "stone": stoneThemeColors,
    "winter": winterThemeColors,
    "winterstone": winterstoneThemeColors,
  };
  public static ThemeCss: { [key: string]: { [key: string]: string } } = { };
  public static ThemeSelector: { [key: string]: string } = {
    "default": ".sv_main ",
    "modern": ".sv-root-modern "
  };

  static autoApplyTheme(): void {
    if(surveyCss.currentType === "bootstrap" || surveyCss.currentType === "bootstrapmaterial") {
      return;
    }

    const includedThemeCss = StylesManager.getIncludedThemeCss();
    if(includedThemeCss.length === 1) {
      StylesManager.applyTheme(includedThemeCss[0].name);
    }
  }

  static getAvailableThemes(): Array<any> {
    const themeMapper = (surveyCss.getAvailableThemes() as Array<string>)
      .filter(themeName => ["defaultV2", "default", "modern"].indexOf(themeName) !== -1)
      .map(themeName => { return { name: themeName, theme: surveyCss[themeName] }; });
    return themeMapper;
  }
  static getIncludedThemeCss(): Array<any> {
    if (typeof settings.environment === "undefined") return [];
    const { rootElement }: ISurveyEnvironment = settings.environment;
    const themeMapper = StylesManager.getAvailableThemes();

    const element = isShadowDOM(rootElement) ? rootElement.host : rootElement;

    if (!!element) {
      const styles = getComputedStyle(element);
      if(styles.length) {
        return themeMapper.filter(item => item.theme.variables && styles.getPropertyValue(item.theme.variables.themeMark));
      }
    }
    return [];
  }

  static findSheet(styleSheetId: string): any {
    if (typeof settings.environment === "undefined") return null;
    const { root: { styleSheets } }: ISurveyEnvironment = settings.environment;
    for (let i = 0; i < styleSheets.length; i++) {
      if (!!styleSheets[i].ownerNode && (<any> styleSheets)[i].ownerNode["id"] === styleSheetId) {
        return <CSSStyleSheet>styleSheets[i];
      }
    }
    return null;
  }

  static createSheet(styleSheetId: string): any {
    const { stylesSheetsMountContainer }: ISurveyEnvironment = settings.environment;

    let style = DomDocumentHelper.createElement("style") as HTMLStyleElement;
    style.id = styleSheetId;
    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")
    style.appendChild(new Text(""));
    getElement(stylesSheetsMountContainer).appendChild(style);
    if (!!StylesManager.Logger) {
      StylesManager.Logger.log("style sheet " + styleSheetId + " created");
    }
    return <CSSStyleSheet>style.sheet;
  }

  public static applyTheme(themeName: string = "default", themeSelector?: string): void {
    if (typeof settings.environment === "undefined") return;
    const { rootElement }: ISurveyEnvironment = settings.environment;
    const element = isShadowDOM(rootElement) ? rootElement.host : rootElement;
    surveyCss.currentType = themeName;

    if (StylesManager.Enabled) {

      if(themeName !== "bootstrap" && themeName !== "bootstrapmaterial") {
        setCssVariables(StylesManager.ThemeColors[themeName], element as HTMLElement);
        if (!!StylesManager.Logger) {
          StylesManager.Logger.log("apply theme " + themeName + " completed");
        }
        return;
      }

      const themeCss = StylesManager.ThemeCss[themeName];
      if(!themeCss) {
        surveyCss.currentType = "defaultV2";
        return;
      }

      StylesManager.insertStylesRulesIntoDocument();

      const currentThemeSelector = themeSelector || StylesManager.ThemeSelector[themeName] || StylesManager.ThemeSelector["default"];
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
    StylesManager.autoApplyTheme();
  }

  public static insertStylesRulesIntoDocument(): any {
    if (StylesManager.Enabled) {
      let sheet = StylesManager.findSheet(StylesManager.SurveyJSStylesSheetId);
      if (!sheet) {
        sheet = StylesManager.createSheet(StylesManager.SurveyJSStylesSheetId);
      }

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
