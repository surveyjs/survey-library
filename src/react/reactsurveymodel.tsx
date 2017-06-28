import * as React from 'react';
import {SurveyModel} from "../survey";

export class ReactSurveyModel extends SurveyModel {
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
    public doAfterRenderSurvey(el) {
        this.afterRenderSurvey(el);
    }
    protected onLoadSurveyFromService() {
        this.render();
    }
    protected onLoadingSurveyFromService() {
        this.render();
    }
    protected setCompletedState(value: string, text: string) {
        super.setCompletedState(value, text);
        this.render();
    }
}
