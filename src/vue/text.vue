<template>
    <div>
        <input v-if="!question.isReadOnly" :class="css.text" :type="question.inputType" :size="question.size" :id="question.inputId" :placeholder="question.placeHolder" :value="question.value" @change="change"/>
        <div v-else :class="css.text">{{question.value}}</div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionTextModel} from '../question_text'

    @Component
    export default class Text extends Question<QuestionTextModel> {
        change(event) {
            this.question.value = event.target.value;
        }
    }
    Vue.component("survey-text", Text)
</script>
