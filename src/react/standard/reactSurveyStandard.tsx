import {ReactSurveyProgress} from './reactSurveyProgressStandard';
import ReactSurveyBase from '../reactSurvey';
import defaultStandardCss from "../../defaultCss/cssstandard";

export default class ReactSurvey extends ReactSurveyBase {
    constructor(props: any) {
        super(props);
    }
    protected renderProgress(isTop: Boolean): JSX.Element {
        return <ReactSurveyProgress survey = {this.survey} css={this.css} isTop = {isTop} />;
    }
    protected createCssObject(): any { return defaultStandardCss; }
}