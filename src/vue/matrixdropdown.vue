<template>
    <div :style="{overflowX: question.horizontalScroll? 'scroll': ''}">
        <table :class="css.matrixdropdown.root">
            <thead>
                <tr>
                    <th></th>
                    <th v-for="column in question.columns" :style="{ minWidth: question.getColumnWidth(column) }">{{question.getColumnTitle(column)}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in question.visibleRows">
                    <td>{{row.text}}</td>
                    <td v-for="cell in row.cells">
                        <survey-errors :question="question" :css="css"/>
                        <component :is="'survey-' + cell.question.getType()" :question="cell.question" :isEditMode="isEditMode" :css="css"/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionMatrixDropdownModel} from '../question_matrixdropdown'

    @Component
    export default class MatrixDropdown extends Question<QuestionMatrixDropdownModel> {
    }
    Vue.component("survey-matrixdropdown", MatrixDropdown)
</script>