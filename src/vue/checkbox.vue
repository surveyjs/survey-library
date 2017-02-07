<template>
    <form :class="css.checkbox.root">
        <div v-for="(item, index) in question.visibleChoices" :class="css.radiogroup.item" :style="{width: question.colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="css.radiogroup.item">
                <input type="checkbox" :name="question.name" :value="item.value" :id="question.inputId + '_' + item.value" @change="change" :disabled="!isEditMode" />
                <span>{{item.text}}</span>
            </label>
        </div>
        <survey-other-choice v-show="question.hasOther && isOtherSelected" :class="css.radiogroup.other" :question="question" :isEditMode="isEditMode" :css="css"/>
    </form>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionCheckboxModel} from '../question_checkbox'

    @Component
    export default class Checkbox extends Question<QuestionCheckboxModel> {
        isOtherSelected = false;

        mounted() {
            this.question.valueChangedCallback = this.onValueChanged;
        }
        beforeDestroy() {
            this.question.valueChangedCallback = undefined; // TODO: ensure this works
        }

        onValueChanged() {
            this.isOtherSelected = this.question.isOtherSelected;
        }
        change(e) {
            let newValue = this.question.value;
            if (!newValue) newValue = [];
            const index = newValue.indexOf(e.target.value);
            if (e.target.checked) {
                if (index === -1) newValue.push(e.target.value);
            } else {
                if (index > -1) newValue.splice(index, 1);
            }

            this.question.value = newValue;
        }
    }
    Vue.component("survey-checkbox", Checkbox)
</script>