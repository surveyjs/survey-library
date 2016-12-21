import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Survey} from "../react/reactSurvey";
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
    }
});

export * from "./react";
export {__assign} from "../assign";