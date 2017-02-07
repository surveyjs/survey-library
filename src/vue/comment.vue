<template>
    <div>
        <input v-if="isEditMode" type="text" :class="css.question.comment" v-model="question.comment"/>
        <div v-else :class="css.question.comment">{{question.comment}}</div>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import Component from 'vue-class-component'
    import {surveyCss} from "../defaultCss/cssstandard"
    import {Question} from '../question'

    @Component({
        props: {
            question: Question,
            isEditMode: Boolean,
            css: surveyCss
        }
    })
    export default class Comment extends Vue {
        question: Question
        isEditMode: boolean
        css: Object
    }
    Vue.component("survey-comment", Comment)
</script>