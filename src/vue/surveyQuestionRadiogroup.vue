<template>
    <form :class="css.radiogroup.root">
        <div v-for="item in question.visibleChoices" :class="css.radiogroup.item" data-bind="style:{width: question.koWidth, 'margin-right': question.colCount == 0 ? '5px': '0px'}">
            <label :class="css.radiogroup.item">
                <input type="radio" data-bind="attr: {name: question.name, value: item.value, id: ($index() == 0) ? question.inputId : ''}, checked: question.koValue, enable: $root.isEditMode" />
                <span>{{item.text}}</span>
            </label>
            <div data-bind="visible: question.hasOther && ($index() == question.koVisibleChoices().length-1)">
                <div data-bind="template: { name: 'survey-comment', data: {'question': question, 'visible': question.koOtherVisible}}, css: $root.css.radiogroup.other"></div>
            </div>
        </div>
    </form>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {default as SurveyQuestion} from './surveyQuestion.vue'
    import {QuestionRadiogroupModel} from '../question_radiogroup'

    @Component({
        props: {
            question: QuestionRadiogroupModel
        }
    })
    export default class SurveyQuestionRadiogroup extends SurveyQuestion<QuestionRadiogroupModel> {
        constructor () {
            super();
        }
    }
    Vue.component("radiogroup", SurveyQuestionRadiogroup)
</script>