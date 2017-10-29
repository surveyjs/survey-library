<template>
    <div v-show="surveyWindow.isShowing" style="position: fixed; bottom: 3px; right: 10px;" :class="css.window.root">
        <div :class="css.window.header.root">
            <a href="#" @click="doExpand" style="width:100%">
                <span style="padding-right:10px" :class="css.window.header.title"><survey-string :locString="windowSurvey.locTitle"/></span>
                <span aria-hidden="true" :class="expandedCss"></span>
            </a>
        </div>
        <div v-show="isExpanded" :class="css.window.body">
            <survey :survey="windowSurvey">
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {SurveyModel} from '../survey'
    import {SurveyWindowModel} from '../surveyWindow'
    import {VueSurveyWindowModel} from './surveyModel'

    @Component
    export default class Window extends Vue {
        @Prop
        window: SurveyWindowModel
        @Prop
        survey: SurveyModel

        surveyWindow: SurveyWindowModel
        constructor () {
            super();
            if(this.window) {
                this.surveyWindow = this.window;
            } else {
                this.surveyWindow = new VueSurveyWindowModel(null, this.survey);
            }
            this.surveyWindow.isShowing = true;
            
            var self = this;
            this.surveyWindow.survey.onComplete.add(function(survey, options){
                Vue.set(self.surveyWindow, "isShowing", false);
            });
        }
        get windowSurvey(): SurveyModel { 
            return this.surveyWindow.survey; 
        }
        get css () {
            return surveyCss.getCss();
        }
        get expandedCss() {
            return this.surveyWindow.isExpanded ? this.css.window.header.buttonCollapsed : this.css.window.header.buttonExpanded;
        }
        get isExpanded(): boolean { return this.surveyWindow.isExpanded; }

        doExpand() {
            this.surveyWindow.isExpanded = !this.surveyWindow.isExpanded;
        }
    }
    Vue.component("survey-window", Window)
</script>
