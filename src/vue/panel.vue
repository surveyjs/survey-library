<template>
    <div>
        <h4 v-show="hasTitle" :class="css.pageTitle">{{question.processedTitle}}</h4>
        <div :style="{margin: getIndentSize(question, question.innerIndent)}">
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
    import {getIndentSize as _getIndentSize} from './getIndentSize'

    @Component
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

        getIndentSize(question: QuestionModel, indent: number): string {
            return _getIndentSize(question, indent)
        }
    }
    Vue.component("survey-panel", Panel)
</script>