<template>
    <div>
        <input v-if="!question.isReadOnly" type="text" :class="question.cssClasses.other" v-model="question.comment"/>
        <div v-else :class="question.cssClasses.other">{{question.comment}}</div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {Question} from '../question'

    @Component
    export default class OtherChoice extends Vue {
        @Prop
        question: Question
    }
    Vue.component("survey-other-choice", OtherChoice)
</script>
