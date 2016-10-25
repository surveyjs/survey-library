// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from 'react';
import { MultipleTextItemModel } from "../question_multipletext";
export declare class SurveyQuestionMultipleText extends React.Component<any, any> {
    private question;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    protected renderRow(key: string, items: Array<MultipleTextItemModel>): JSX.Element;
    protected renderItem(item: MultipleTextItemModel): JSX.Element;
}
export declare class SurveyQuestionMultipleTextItem extends React.Component<any, any> {
    private item;
    protected css: any;
    constructor(props: any);
    handleOnChange(event: any): void;
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    protected mainClassName: string;
}
