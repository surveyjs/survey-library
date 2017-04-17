<template>
    <table :class="css.matrix.root">
        <thead>
            <tr>
                <th v-show="question.hasRows"></th>
                <th v-for="column in question.columns"><survey-string :locString="column.locText"/></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, rowIndex) in question.visibleRows">
                <td v-show="question.hasRows"><survey-string :locString="row.locText"/></td>
                <td v-for="(column, columnIndex) in question.columns">
                    <input type="radio" :name="row.fullName" v-model="row.value" :value="column.value" :disabled="question.isReadOnly" :id="(columnIndex === 0) && (rowIndex === 0) ? question.inputId : ''"/>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionMatrixModel} from '../question_matrix'

    @Component
    export default class Matrix extends Question<QuestionMatrixModel> {
    }
    Vue.component("survey-matrix", Matrix)
</script>