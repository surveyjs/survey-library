import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Survey} from "../react/reactSurvey";
import {SurveyWindow} from "../react/reactSurveyWindow";

export class SurveyNG {
    public static render(elementId: string | Element, props) {
        var element: Element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
        ReactDOM.render(<Survey {...props} />, element);
    }
}

export class SurveyWindowNG {
    public static render(elementId: string | Element, props) {
        var element: Element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
        ReactDOM.render(<SurveyWindow {...props} />, element);
    }
}
