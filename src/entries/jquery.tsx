import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Survey} from "../react/reactSurvey";
import {SurveyWindow} from "../react/reactSurveyWindow";
import jQuery from 'jquery';

jQuery["fn"].extend({
    Survey: function(props) {
        this.each(
            function() {
                ReactDOM.render((
                    <Survey {...props}/>
                ), this);
            }
        );
    },

    SurveyWindow: function(props) {
        this.each(
            function() {
                ReactDOM.render((
                    <SurveyWindow {...props}/>
                ), this);
            }
        );
    }
});

export * from "./react";
