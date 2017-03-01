<template>
    <form :class="css.checkbox.root">
        <div v-for="(item, index) in question.visibleChoices" :class="css.radiogroup.item" :style="{width: colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="css.radiogroup.item">
                <input type="checkbox" :name="question.name" :value="item.value" v-model="value" :id="question.inputId + '_' + item.value" :disabled="!isEditMode" />
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
        isUpdatingQuestion = false;
        isOtherSelected = false;
        value = [];

        // TODO may be need to move to the model
        get colWidth() {
            var colCount = this.question.colCount;
            return colCount > 0 ? (100 / colCount) + '%' : "";
        }

        onValueChanged() {
            if(!this.isUpdatingQuestion) {
                if(this.question.value === undefined) {
                    this.question.value = [];
                }
                this.value = this.question.value;
            }
            this.isOtherSelected = this.question.isOtherSelected;
        }

        mounted() {
            this.onValueChanged();
            this.question.valueChangedCallback = this.onValueChanged;
        }

        @Watch('value')
        onSelectedValuesChanged(val: Array<any>, oldVal: Array<any>) {
            this.isUpdatingQuestion = true;
            try {
                this.question.value = this.value;
            }
            finally {
                this.isUpdatingQuestion = false;
            }
        }
        @Watch('question')
        onQuestionChanged(val: QuestionCheckboxModel, oldVal: QuestionCheckboxModel) {
            this.onValueChanged();
            if(!!oldVal) {
                oldVal.valueChangedCallback = undefined;
            }
            if(!!val) {
                val.valueChangedCallback = this.onValueChanged;
            }
        }
    }
    Vue.component("survey-checkbox", Checkbox)
</script>