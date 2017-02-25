<template>
    <div :class="css.dropdown.root">
        <select v-if="isEditMode" :id="question.inputId" v-model="question.value" :class="css.dropdown.control">
            <option value="">{{question.optionsCaption}}</option>
            <option v-for="(item, index) in question.visibleChoices" :value="item.value">{{item.text}}</option>
        </select>
        <div v-else :text="question.value" :class="css.dropdown"></div>
        <survey-other-choice v-show="question.hasOther && isOtherSelected" :class="css.radiogroup.other" :question="question" :isEditMode="isEditMode" :css="css"/>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionDropdownModel} from '../question_dropdown'

    @Component
    export default class Dropdown extends Question<QuestionDropdownModel> {
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
    Vue.component("survey-dropdown", Dropdown)
</script>