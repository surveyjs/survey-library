// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import * as React from 'react';
export declare class SurveyNavigation extends React.Component<any, any> {
    private survey;
    protected css: any;
    constructor(props: any);
    componentWillReceiveProps(nextProps: any): void;
    handlePrevClick(event: any): void;
    handleNextClick(event: any): void;
    handleCompleteClick(event: any): void;
    render(): JSX.Element;
    protected renderButton(click: any, text: string, btnClassName: string): JSX.Element;
}
