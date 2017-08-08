import Vue from 'vue';
import {SurveyModel} from "../survey";
import {surveyCss} from "../defaultCss/cssstandard";

export class VueSurveyModel extends SurveyModel {
    private vueValuesHash: {[index: string]: any};
    renderCallback: () => void;
    constructor(jsonObj: any = null) {
        super(jsonObj);
        this.createValueHash();
    }
    public render() {
        if (this.renderCallback) {
            this.renderCallback();
        }
    }
    endLoadingFromJson() { 
        this.createValueHash();
        super.endLoadingFromJson();
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
    protected _setDataValue(data: any, key: string) {
        super._setDataValue(data, key);
        this.vueValuesHash[key] = data[key];
    }
    getValue(name: string): any {
        if (!name || name.length === 0) return null;
        var value = this.vueValuesHash ? this.vueValuesHash[name] : null;
        return super.getUnbindValue(value);
    }
    protected notifyQuestionOnValueChanged(name: string, newValue: any) {
        if(this.vueValuesHash) {
            this.vueValuesHash[name] = newValue;
        }
        super.notifyQuestionOnValueChanged(name, newValue);
    }
    private createValueHash() {
        if(this.vueValuesHash) return;
        this.vueValuesHash = {};
        this.getAllQuestions().forEach(question => this.vueValuesHash[question.name] = undefined);
    }
}
