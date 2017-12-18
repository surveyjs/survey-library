export class StylesManager {
  private sheet: CSSStyleSheet = null;
  private static SurveyJSStylesSheetId = "surveyjs";
  public static Styles: { [key: string]: string } = {
    // ".sv_bootstrap_css":
    //   "position: relative; width: 100%; background-color: #f4f4f4",
    // ".sv_bootstrap_css .sv_custom_header":
    //   "position: absolute; width: 100%; height: 275px; background-color: #e7e7e7;",
    // ".sv_bootstrap_css .sv_container":
    //   "max-width: 80%; margin: auto; position: relative; color: #6d7072; padding: 0 1em;",
    // ".sv_bootstrap_css .panel-body":
    //   "background-color: white; padding: 1em 1em 5em 1em; border-top: 2px solid lightgray;",
    // ".sv_bootstrap_css .sv_qstn": "padding: 0.5em 1em 1.5em 1em;",

    ".sv_qstn": "display: inline-block; vertical-align: top;",
    ".progress": "width: 60%;",
    ".progress-bar": "width: auto; margin-left: 2px; margin-right: 2px;",
    ".sv_p_container": "display: inline-block; vertical-align: top;",
    ".sv_qbln .checkbox-material": "margin-right: 3px;",
    ".sv_qcbx .checkbox-material": "margin-right: 5px;",
    ".sv_qcbx .checkbox label": "justify-content: left; display: inline-block;",
    ".sv_qstn .radio label": "justify-content: left; display: inline-block;",
    ".sv_qstn label.sv_q_m_label": "position: absolute; margin: 0;",
    ".sv_q_mt_item_value": "float: left;",
    ".sv_qstn.sv_qstn_left": "margin-top: 0.75em;",
    ".sv_qstn .title-left": "float: left; margin-right: 1em;",
    ".sv_qstn .content-left": "overflow: hidden",
    ".sv_q_radiogroup_inline .sv_q_radiogroup_other": "display: inline-block;",
    ".sv_q_checkbox_inline .sv_q_checkbox_other": "display: inline-block;",
    ".sv_q_checkbox_inline, .sv_q_radiogroup_inline": "line-height: 2.5em;",
    ".form-inline .sv_q_checkbox_inline:not(:last-child)": "margin-right: 1em;",
    ".form-inline .sv_q_radiogroup_inline:not(:last-child)":
      "margin-right: 1em;",
    ".sv_qstn fieldset": "border: none; margin: 0; padding: 0;",
    "fieldset.form-inline": "display: inline-block;"
  };

  findSheet() {
    for (let i = 0; i < document.styleSheets.length; i++) {
      if (
        document.styleSheets[i].ownerNode["id"] ===
        StylesManager.SurveyJSStylesSheetId
      ) {
        return <CSSStyleSheet>document.styleSheets[i];
      }
    }
    return null;
  }
  createSheet() {
    let style = document.createElement("style");
    style.id = StylesManager.SurveyJSStylesSheetId;
    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute("media", "screen")
    // style.setAttribute("media", "only screen and (max-width : 1024px)")
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return <CSSStyleSheet>style.sheet;
  }

  constructor() {
    this.sheet = this.findSheet();
    if (!this.sheet) {
      this.sheet = this.createSheet();
      this.initializeStyles();
    }
  }

  public initializeStyles() {
    Object.keys(StylesManager.Styles).forEach(selector =>
      this.sheet.insertRule(
        selector + "{ " + StylesManager.Styles[selector] + " }",
        0
      )
    );
  }
}
