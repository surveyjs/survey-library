<template>
    <form :class="css.checkbox.root">
        <div v-for="(item, index) in question.visibleChoices" :class="css.radiogroup.item" :style="{width: '100%', 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="css.radiogroup.item">
                <input type="checkbox" :name="question.name" :value="item.value" v-model="value" :id="question.inputId + '_' + item.value" :disabled="!isEditMode" />
                <span>{{item.text}}</span>
            </label>
        </div>
        <survey-other-choice v-show="question.hasOther && question.isOtherSelected" :class="css.radiogroup.other" :question="question" :isEditMode="isEditMode" :css="css"/>
    </form>
</template>

<script lang="ts">
    import * as Vue from 'vue'
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
    }
    Vue.component("survey-checkbox", Checkbox)
</script>