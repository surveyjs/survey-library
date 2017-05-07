<template>
    <div>
        <h4 v-show="hasTitle" :class="css.pageTitle"><survey-string :locString="question.locTitle"/></h4>
        <div :style="{ marginLeft: getIndentSize(question, question.innerIndent) }">
            <div v-for="row in rows" v-show="row.visible" :class="css.row">
                <survey-row :row="row" :survey="survey" :css="css"></survey-row>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {PanelModelBase, PanelModel, QuestionRowModel} from "../panel"
    import {Question as QuestionModel} from '../question'
    import {ISurvey} from '../base'
    import {helpers} from './helpers'

    @Component({
        mixins: [helpers]
    })
    export default class Panel extends Vue {
        @Prop
        question: PanelModel
        @Prop
        isEditMode: Boolean
        @Prop
        css: any

        get rows () {
            return this.question.rows;
        }
        get hasTitle() {
            return this.question.title.length > 0
        }
        get survey () {
            return this.question.data;
        }
    }
    Vue.component("survey-panel", Panel)
</script>
