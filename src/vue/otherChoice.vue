<template>
    <div>
        <input v-if="isEditMode" type="text" :class="css.question.comment" v-model="question.comment"/>
        <div v-else :class="css.question.comment">{{question.comment}}</div>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {Question} from '../question'

    @Component
    export default class OtherChoice extends Vue {
        @Prop
        question: Question
        @Prop
        isEditMode: boolean
        @Prop
        css: Object
    }
    Vue.component("survey-other-choice", OtherChoice)
</script>