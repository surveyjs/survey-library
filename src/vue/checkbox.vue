<template>
    <form :class="question.cssClasses.root">
        <div v-for="(item, index) in question.visibleChoices" :class="itemClass" :style="{'display': 'inline-block', width: colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="question.cssClasses.label">
                <input type="checkbox" :name="question.name" :value="item.value" v-model="value" :id="question.inputId + '_' + item.value" :disabled="question.isReadOnly" v-bind:aria-label="question.locTitle.renderedHtml"/>
                <span class="checkbox-material"><span class="check"></span></span>
                <survey-string :locString="item.locText"/>
                <survey-other-choice v-show="question.hasOther && question.isOtherSelected && index === choicesCount" :class="question.cssClasses.other" :question="question" />
            </label>
        </div>
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
            if(this.innerValue === null) {
                this.innerValue = !this.question.isEmpty() ? this.question.value : [];
            }
            return this.innerValue;
        }
        set value(newVal) {
            this.question.value = newVal;
            this.innerValue = newVal;
        }
        get colWidth() {
            var colCount = this.question.colCount;
            return colCount > 0 ? (100 / colCount) + '%' : "";
        }
        get choicesCount() {
            return this.question.visibleChoices.length - 1;
        }
        get itemClass() {
            return this.question.cssClasses.item + (this.question.colCount === 0 ? " sv_q_checkbox_inline": "");
        }
    }
    Vue.component("survey-checkbox", Checkbox)
</script>
