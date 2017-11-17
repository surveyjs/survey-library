<template>
    <div>
        <div v-if="element.titleLocation === 'top' || element.titleLocation === 'left'" :class="element.titleLocation === 'left' ? 'title-left' : ''">
            <h5 v-if="element.hasTitle" :class="element.cssClasses.title"><survey-string :locString="element.locTitle"/></h5>
            <div v-if="element.hasDescription" :class="element.cssClasses.description"><survey-string :locString="element.locDescription"/></div>
        </div>

        <div :class="element.titleLocation === 'left' ? 'content-left' : ''">
            <survey-errors v-if="survey.questionErrorLocation === 'top'" :question="element"/>
            <component :is="getWidgetComponentName(element)" :question="element" :css="css"/>
            <div v-if="element.hasComment">
                <div>{{element.commentText}}</div>
                <survey-other-choice :commentClass="css.comment" :question="element"/>
            </div>
            <survey-errors v-if="survey.questionErrorLocation === 'bottom'" :question="element"/>
            <h5 v-if="element.hasTitle" v-show="element.titleLocation === 'bottom'" :class="element.cssClasses.title"><survey-string :locString="element.locTitle"/></h5>
            <div v-if="element.hasDescription" :class="element.cssClasses.description" v-show="element.titleLocation === 'bottom'"><survey-string :locString="element.locDescription"/></div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {SurveyModel} from '../survey'
    import {IElement, IQuestion} from '../base'
    import {Question as QuestionModel} from '../question'
    import {helpers} from './helpers'

    @Component
    export default class SurveyElement extends Vue {
        @Prop
        css: any
        @Prop
        survey: SurveyModel
        @Prop
        element: IElement
        
        getWidgetComponentName(element: QuestionModel) {
            if(element.customWidget) {
                return "survey-customwidget";
            }
            return 'survey-' + element.getTemplate();
        }
        mounted() {
            if(this.survey && !this.element.isPanel) {
                this.survey.afterRenderQuestion(<IQuestion>this.element, this.$el);
            }
        }
    }
    Vue.component("survey-element", SurveyElement)
</script>
