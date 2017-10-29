<template>
    <div v-show="window.isShowing" style="position: fixed; bottom: 3px; right: 10px;" :class="css.window.root">
        <div :class="css.window.header.root">
            <a href="#" @click="doExpand" style="width:100%">
                <span style="padding-right:10px" :class="css.window.header.title"><survey-string :locString="survey.locTitle"/></span>
                <span aria-hidden="true" :class="expandedCss"></span>
            </a>
        </div>
        <div v-show="window.isExpanded" :class="css.window.body">
            <survey :survey="survey">
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {SurveyModel} from '../survey'
    import {SurveyWindowModel} from '../surveyWindow'

    @Component
    export default class Window extends Vue {
        @Prop
        survey: SurveyModel
        window: SurveyWindowModel

        constructor () {
            super();
            if(!this.window) {
                this.window = new SurveyWindowModel(null, this.survey);
            }
            this.survey = this.window.survey;
            this.window.isShowing = true;
            
            var self = this;
            this.window.survey.onComplete.add(function(survey, options){
                self.window.hide();
            });
            this.window.showingChangedCallback = function(){ Vue.set(self.window, "isShowing", self.window.isShowing); }
            this.window.expandedChangedCallback = function(){ Vue.set(self.window, "isExpanded", self.window.isExpanded);}
        }
        get css () {
            return surveyCss.getCss();
        }
        get expandedCss() {
            return this.window.isExpanded ? this.css.window.header.buttonCollapsed : this.css.window.header.buttonExpanded;
        }
        doExpand() {
            this.window.isExpanded = !this.window.isExpanded;
        }
    }
    Vue.component("survey-window", Window)
</script>
