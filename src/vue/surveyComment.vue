<template>
    <div>
        <input v-if="isEditMode" type="text" v-show="visible" :class="css.question.comment" v-model="question.comment"/>
        <div v-else v-show="visible" :class="css.question.comment">{{question.comment}}</div>
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
            css: surveyCss,
            visible: Boolean
        }
    })
    export default class SurveyComment extends Vue {
        question: Question
        isEditMode: boolean
        css: Object
        visible: boolean
        constructor () {
            super();
        }
    }
    Vue.component("SurveyComment", SurveyComment)
</script>