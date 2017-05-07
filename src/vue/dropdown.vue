<template>
    <div :class="css.dropdown.root">
        <select v-if="!question.isReadOnly" :id="question.inputId" v-model="question.value" :class="css.dropdown.control">
            <option value=undefined>{{question.optionsCaption}}</option>
            <option v-for="(item, index) in question.visibleChoices" :value="item.value">{{item.text}}</option>
        </select>
        <div v-else :text="question.value" :class="css.dropdown.control"></div>
        <survey-other-choice v-show="question.hasOther && question.isOtherSelected" :class="css.radiogroup.other" :question="question" :css="css"/>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionDropdownModel} from '../question_dropdown'

    @Component
    export default class Dropdown extends Question<QuestionDropdownModel> {}
    Vue.component("survey-dropdown", Dropdown)
</script>
