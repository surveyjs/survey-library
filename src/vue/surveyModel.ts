import {SurveyModel} from "../survey";

export class VueSurveyModel extends SurveyModel {
    renderCallback: () => void;
    constructor(jsonObj: any = null) {
        super(jsonObj);
    }
    public render() {
        if (this.renderCallback) {
            this.renderCallback();
        }
    }
    public mergeCss(src: any, dest: any) {
        this.mergeValues(src, dest);
    }
    protected onLoadSurveyFromService() {
        this.render();
    }
    protected onLoadingSurveyFromService() {
        this.render();
    }
}