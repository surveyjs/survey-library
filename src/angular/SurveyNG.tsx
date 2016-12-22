import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Survey} from "../react/reactSurvey";
import {SurveyWindow} from "../react/reactSurveyWindow";

export class SurveyNG {
    public static render(elementId, props){
        ReactDOM.render(<Survey {...props} />, document.getElementById(elementId));
    }
}

export class SurveyWindowNG {
    public static render(elementId, props){
        ReactDOM.render(<SurveyWindow {...props} />, document.getElementById(elementId));
    }
}