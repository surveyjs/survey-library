import * as React from 'react';
import {SurveyModel} from "../survey";

export class SurveyNavigationBase extends React.Component<any, any> {
    protected survey: SurveyModel;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.survey = props.survey;
        this.css = props.css;
        this.state = { update: 0 };
    }
    componentWillReceiveProps(nextProps: any) {
        this.survey = nextProps.survey;
        this.css = nextProps.css;
    }
    private updateStateFunction: any = null;
    componentDidMount() {
        if (this.survey) {
            var self = this;
            this.updateStateFunction = function () {
                self.state.update = self.state.update + 1;
                self.setState(self.state);
            }
            this.survey.onPageVisibleChanged.add(this.updateStateFunction);
        }
    }
    componentWillUnmount() {
        if (this.survey && this.updateStateFunction) {
            this.survey.onPageVisibleChanged.remove(this.updateStateFunction);
            this.updateStateFunction = null;
        }
    }
}
