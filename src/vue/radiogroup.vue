<template>
    <form :class="css.radiogroup.root">
        <div v-for="(item, index) in question.visibleChoices" :class="css.radiogroup.item" :style="{width: question.colWidth, 'margin-right': question.colCount === 0 ? '5px': '0px'}">
            <label :class="css.radiogroup.item">
                <input type="radio" :name="question.name" :value="item.value" :id="question.inputId + '_' + item.value" v-model="question.value" :disabled="!isEditMode" />
                <span>{{item.text}}</span>
            </label>
        </div>
        <survey-comment v-show="question.hasOther && isOtherSelected" :class="css.radiogroup.other" :question="question" :isEditMode="isEditMode" :css="css"/>
    </form>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {default as Question} from './question.vue'
    import {QuestionRadiogroupModel} from '../question_radiogroup'

    @Component({
        props: {
            question: QuestionRadiogroupModel,
            isEditMode: Boolean,
            css: surveyCss
        }
    })
    export default class Radiogroup extends Question<QuestionRadiogroupModel> {
        onValueChanged() {
            this.isOtherSelected = this.question.isOtherSelected;
        }
        constructor () {
            super();
        }
        isOtherSelected = false;
        mounted() {
            this.question.valueChangedCallback = this.onValueChanged;
        }
        beforeDestroy() {
            this.question.valueChangedCallback = undefined; // TODO: ensure this works
        }
    }
    Vue.component("survey-radiogroup", Radiogroup)
</script>