import Vue from 'vue';
import {SurveyModel} from "../survey";
import {IQuestion} from "../base";
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
    protected setPropertyValueCore(propertiesHash: any, name: string, val: any) {
        Vue.set(propertiesHash, name, val);
    }
    questionAdded(question: IQuestion, index: number, parentPanel: any, rootPanel: any) {
        var q: any; q = question;
        q.setPropertyValueCoreHandler = function(propertiesHash: any, name: string, val: any) {
            Vue.set(propertiesHash, name, val);
        };
        super.questionAdded(question, index, parentPanel, rootPanel);
    }
}
