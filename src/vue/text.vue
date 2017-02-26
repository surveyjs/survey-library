<template>
    <div>
        <input v-if="isEditMode" :class="css.text" :type="question.inputType" :size="question.size" :id="question.inputId" :placeholder="question.placeHolder" :value="value" @change="change"/>
        <div v-else :class="css.text">{{question.value}}</div>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionTextModel} from '../question_text'

    @Component
    export default class Text extends Question<QuestionTextModel> {
        value = '';

        mounted() {
            this.question.valueChangedCallback = this.onValueChanged;
            this.value = this.question.value || '';
        }
        beforeDestroy() {
            this.question.valueChangedCallback = undefined; // TODO: ensure this works
        }

        onValueChanged() {
            this.value = this.question.value;
        }

        change(event) {
            this.question.value = event.target.value;
        }
    }
    Vue.component("survey-text", Text)
</script>