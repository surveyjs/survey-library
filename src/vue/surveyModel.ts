import Vue from 'vue';
import {SurveyModel} from "../survey";
import {surveyCss} from "../defaultCss/cssstandard";

export class VueSurveyModel extends SurveyModel {
    renderCallback: () => void;
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
    get css () {
        return surveyCss.getCss();
    }
    set css(value: any) {
        this.mergeValues(value, this.css);
    }
    protected setDataValueCore(valuesHash: any, key: string, value: any) {
        Vue.set(valuesHash, key, value);
    }
}
