<template>
    <div>
        <div v-if="element.visible" v-for="element in row.elements" :key="element.idValue" :class="css.question.mainRoot" :id="element.id" :style="{ paddingLeft: getIndentSize(element, element.indent), paddingRight: getIndentSize(element, element.rightIndent), width: element.renderWidth }">
            <h5 v-if="element.hasTitle" :class="css.question.title" v-show="survey.questionTitleLocation === 'top'"><survey-string :locString="element.locTitle"/></h5>
            <div v-if="element.hasDescription" :class="css.question.description" v-show="survey.questionTitleLocation === 'top'"><survey-string :locString="element.locDescription"/></div>
            <survey-errors v-if="survey.questionErrorLocation === 'top'" :question="element"/>
            <component :is="getWidgetComponentName(element)" :question="element" :css="css"/>
            <div v-show="element.hasComment">
                <div>{{element.commentText}}</div>
                <survey-comment :question="element"/>
            </div>
            <survey-errors v-if="survey.questionErrorLocation === 'bottom'" :question="element"/>
            <h5 v-if="element.hasTitle" v-show="survey.questionTitleLocation === 'bottom'" :class="css.question.title"><survey-string :locString="element.locTitle"/></h5>
            <div v-if="element.hasDescription" :class="css.question.description" v-show="survey.questionTitleLocation === 'bottom'"><survey-string :locString="element.locDescription"/></div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {SurveyModel} from '../survey'
    import {PanelModelBase, PanelModel, QuestionRowModel} from "../panel"
    import {Question as QuestionModel} from '../question'
    import {helpers} from './helpers'

    @Component({
        mixins: [helpers]
    })
    export default class Row extends Vue {
        @Prop
        row: any
        @Prop
        css: any
        @Prop
        survey: SurveyModel

        getWidgetComponentName(element: QuestionModel) {
            if(element.customWidget) {
                return element.customWidget.name;
            }
            return 'survey-' + element.getType();
        }
    }
    Vue.component("survey-row", Row)
</script>
