// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from 'react';
import { QuestionCheckboxModel } from "../question_checkbox";
import { ItemValue } from "../base";
export declare class SurveyQuestionCheckbox extends React.Component<any, any> {
    protected question: QuestionCheckboxModel;
    protected css: any;
    protected rootCss: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    protected getItems(): Array<any>;
    protected textStyle: any;
    protected renderItem(key: string, item: any): JSX.Element;
}
export declare class SurveyQuestionCheckboxItem extends React.Component<any, any> {
    protected question: QuestionCheckboxModel;
    protected item: ItemValue;
    protected css: any;
    protected rootCss: any;
    protected textStyle: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    handleOnChange(event: any): void;
    render(): JSX.Element;
    protected inputStyle: any;
    protected renderCheckbox(isChecked: boolean, divStyle: any, otherItem: JSX.Element): JSX.Element;
    protected renderOther(): JSX.Element;
}
