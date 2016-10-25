// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from 'react';
import { QuestionRadiogroupModel } from "../question_radiogroup";
import { ItemValue } from "../base";
export declare class SurveyQuestionRadiogroup extends React.Component<any, any> {
    protected question: QuestionRadiogroupModel;
    protected css: any;
    protected rootCss: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    handleOnChange(event: any): void;
    render(): JSX.Element;
    protected getItems(): Array<any>;
    protected textStyle: any;
    private renderItem(key, item);
    protected renderRadio(key: string, item: ItemValue, isChecked: boolean, divStyle: any, otherItem: JSX.Element): JSX.Element;
    protected renderOther(): JSX.Element;
}
