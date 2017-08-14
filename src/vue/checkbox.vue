<template>
    <form :class="question.cssClasses.root">
        <div v-for="(item, index) in question.visibleChoices" :class="question.cssClasses.item" :style="{'display': 'inline-block', width: colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="question.cssClasses.item">
                <input type="checkbox" :name="question.name" :value="item.value" v-model="value" :id="question.inputId + '_' + item.value" :disabled="question.isReadOnly" />
                <span class="checkbox-material"><span class="check"></span></span>
                <survey-string :locString="item.locText"/>
            </label>
        </div>
        <survey-other-choice v-show="question.hasOther && question.isOtherSelected" :class="question.cssClasses.other" :question="question" />
    </form>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop, Watch} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionCheckboxModel} from '../question_checkbox'

    @Component
    export default class Checkbox extends Question<QuestionCheckboxModel> {
        get value() {
            return this.question.value || [];
        }
        set value(newVal) {
            this.question.value = newVal;
        }
        get colWidth() {
            var colCount = this.question.colCount;
            return colCount > 0 ? (100 / colCount) + '%' : "";
        }
    }
    Vue.component("survey-checkbox", Checkbox)
</script>
