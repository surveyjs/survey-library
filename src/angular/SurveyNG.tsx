import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Survey} from "../react/reactSurvey";

export class SurveyNG {
    public static render(elementId, props){
        ReactDOM.render(<Survey {...props} />, document.getElementById(elementId));
    }
}