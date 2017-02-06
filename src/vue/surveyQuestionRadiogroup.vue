<template>
    <form :class="css.radiogroup.root">
        <div v-for="(item, index) in question.visibleChoices" :class="css.radiogroup.item" :style="{width: question.colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="css.radiogroup.item">
                <input type="radio" :name="question.name" :value="item.value" :id="(index === 0) ? question.inputId : ''" v-model="question.value" :disabled="!isEditMode" />
                <span>{{item.text}}</span>
            </label>
        </div>
        <SurveyComment v-show="question.hasOther" :class="css.radiogroup.other" :question="question" :isEditMode="isEditMode" :css="css" :visible="question.isOtherSelected"></SurveyComment>
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
            question: QuestionRadiogroupModel,
            isEditMode: Boolean,
            css: surveyCss
        }
    })
    export default class SurveyQuestionRadiogroup extends SurveyQuestion<QuestionRadiogroupModel> {
        constructor () {
            super();
        }
    }
    Vue.component("radiogroup", SurveyQuestionRadiogroup)
</script>