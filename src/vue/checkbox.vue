<template>
    <form :class="css.checkbox.root">
        <div v-for="(item, index) in question.visibleChoices" :class="css.radiogroup.item" :style="{width: colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="css.radiogroup.item">
                <input type="checkbox" :name="question.name" :value="item.value" v-model="selectedValues" :id="question.inputId + '_' + item.value" :disabled="!isEditMode" />
                <span>{{item.text}}</span>
            </label>
        </div>
        <survey-other-choice v-show="question.hasOther && isOtherSelected" :class="css.radiogroup.other" :question="question" :isEditMode="isEditMode" :css="css"/>
    </form>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop, Watch} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionCheckboxModel} from '../question_checkbox'

    @Component
    export default class Checkbox extends Question<QuestionCheckboxModel> {
        isOtherSelected = false;
        selectedValues = [];

        constructor() {
            super();
            this.selectedValues = this.question.value || [];
            this.isOtherSelected = this.question.isOtherSelected;
        }

        // TODO may be need to move to the model
        get colWidth() {
            var colCount = this.question.colCount;
            return colCount > 0 ? (100 / colCount) + '%' : "";
        }

        @Watch('selectedValues')
        onSelectedValuesChanged(val: Array<any>, oldVal: Array<any>) {
            this.question.value = this.selectedValues;
            this.isOtherSelected = this.question.isOtherSelected;
        }
    }
    Vue.component("survey-checkbox", Checkbox)
</script>