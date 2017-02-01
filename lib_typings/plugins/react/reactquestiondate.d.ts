// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import * as React from 'react';
export default class SurveyQuestionDate extends React.Component<any, any> {
    private question;
    protected css: any;
    constructor(props: any);
    handleOnChange(event: any): void;
    componentWillReceiveProps(nextProps: any): void;
    componentDidMount(): void;
    render(): JSX.Element;
    private getDateId();
    private getDivId();
}
