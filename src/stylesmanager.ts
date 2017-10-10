
export class StylesManager {
    private sheet: CSSStyleSheet = null;
    private static SurveyJSStylesSheetId = "surveyjs";
    public static Styles: {[key: string]: string} = {
        '.sv_qstn': 'display: inline-block; vertical-align: top;',
        '.sv_p_container': 'display: inline-block; vertical-align: top;',
        '.sv_qbln .checkbox-material': 'margin-right: 3px;',
        '.sv_qcbx .checkbox-material': 'margin-right: 5px;',
        '.sv_qstn label.sv_q_m_label': 'position: absolute; margin: 0;'
    };

    findSheet() {
        for(let i = 0; i < document.styleSheets.length; i++) {
            if(document.styleSheets[i].ownerNode['id'] === StylesManager.SurveyJSStylesSheetId) {
                return <CSSStyleSheet>document.styleSheets[i];
            }
        }
        return null;
    }
    createSheet() {
        let style = document.createElement('style');
        style.id = StylesManager.SurveyJSStylesSheetId;
        // Add a media (and/or media query) here if you'd like!
        // style.setAttribute("media", "screen")
        // style.setAttribute("media", "only screen and (max-width : 1024px)")
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        return <CSSStyleSheet>style.sheet;
    }

    constructor() {
        this.sheet = this.findSheet();
        if(!this.sheet) {
            this.sheet = this.createSheet();
            this.initializeStyles();
        }
    }

    public initializeStyles() {
        Object.keys(StylesManager.Styles).forEach(selector => this.sheet.addRule(selector, StylesManager.Styles[selector]));
    }
}
