/// <reference path="../survey.ts" />

class ReactSurveyModel extends Survey.SurveyModel {
    renderCallback: () => void;
    constructor(jsonObj: any = null) {
        super(jsonObj);
    }
    public render() {
        if (this.renderCallback) {
            this.renderCallback();
        }
    }
    protected onLoadSurveyFromService() {
        this.render();
    }
    protected onLoadingSurveyFromService() {
        this.render();
    }
}
