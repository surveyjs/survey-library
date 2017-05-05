import * as React from 'react';
import {ItemValue} from "../itemvalue";
import {LocalizableString} from "../localizablestring";
import {QuestionBase} from '../questionbase';
import {ISurveyCreator} from "./reactquestion";

export class SurveyElementBase extends React.Component<any, any> {
    public static renderLocString(locStr: LocalizableString, style: any = null): JSX.Element {
        if (locStr.hasHtml) {
            let htmlValue = { __html: locStr.renderedHtml };
            return <span style={style} dangerouslySetInnerHTML={htmlValue} />;
        }
        return <span style={style}>{locStr.renderedHtml}</span>;
    }
    protected css: any;
    protected rootCss: any;
    protected isDisplayMode: boolean;
    constructor(props: any) {
        super(props);
        this.css = props.css;
        this.rootCss = props.rootCss;
        this.isDisplayMode = props.isDisplayMode || false;
    }
    componentWillReceiveProps(nextProps: any) {
        this.css = nextProps.css;
        this.rootCss = nextProps.rootCss;
        this.isDisplayMode = nextProps.isDisplayMode || false;
    }
    protected renderLocString(locStr: LocalizableString, style: any = null): JSX.Element {
        return SurveyElementBase.renderLocString(locStr, style);
    }
}

export class SurveyQuestionElementBase extends SurveyElementBase {
    protected questionBase: QuestionBase;
    protected creator: ISurveyCreator;
    constructor(props: any) {
        super(props);
        this.questionBase = props.question;
        this.creator = props.creator;
    }
    componentWillReceiveProps(nextProps: any) {
        super.componentWillReceiveProps(nextProps);
        this.questionBase = nextProps.question;
        this.creator = nextProps.creator;
    }
    protected shouldComponentUpdate(): boolean {
        return !this.questionBase.customWidget
            || !!this.questionBase.customWidgetData.isNeedRender
            || !!this.questionBase.customWidget.widgetJson.render;
    }
}
