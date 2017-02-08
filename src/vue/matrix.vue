<template>
    <table :class="css.matrix.root">
        <thead>
            <tr>
                <th v-show="question.hasRows"></th>
                <th v-for="column in question.columns">{{column.text}}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, rowIndex) in question.visibleRows">
                <td v-show="question.hasRows">{{row.text}}</td>
                <td v-for="(column, columnIndex) in question.columns">
                    <input type="radio" :name="row.fullName" v-model="row.value" :value="column.value" :disabled="!isEditMode" :id="(columnIndex === 0) && (rowIndex === 0) ? question.inputId : ''"/>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionMatrixModel} from '../question_matrix'

    @Component
    export default class Matrix extends Question<QuestionMatrixModel> {
    }
    Vue.component("survey-matrix", Matrix)
</script>