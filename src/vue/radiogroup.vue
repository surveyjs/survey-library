<template>
    <form :class="css.radiogroup.root">
        <div v-for="(item, index) in question.visibleChoices" :class="css.radiogroup.item" :style="{width: question.colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="css.radiogroup.item">
                <input type="radio" :name="question.name" :value="item.value" :id="question.inputId + '_' + item.value" v-model="question.value" :disabled="!isEditMode" />
                <span>{{item.text}}</span>
            </label>
        </div>
        <survey-other-choice v-show="question.hasOther && isOtherSelected" :class="css.radiogroup.other" :question="question" :isEditMode="isEditMode" :css="css"/>
    </form>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionRadiogroupModel} from '../question_radiogroup'

    @Component
    export default class Radiogroup extends Question<QuestionRadiogroupModel> {
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
    }
    Vue.component("survey-radiogroup", Radiogroup)
</script>