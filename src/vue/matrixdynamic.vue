<template>
    <div :style="{overflowX: question.horizontalScroll? 'scroll': ''}">
        <table :class="css.matrixdynamic.root">
            <thead>
                <tr>
                    <th v-for="column in question.columns" :style="{ minWidth: question.getColumnWidth(column) }">{{question.getColumnTitle(column)}}</th>
                    <th v-if="isEditMode"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in question.visibleRows">
                    <td v-for="cell in row.cells">
                        <survey-errors :question="question" :css="css"/>
                        <component :is="'survey-' + cell.question.getType()" :question="cell.question" :isEditMode="isEditMode" :css="css"/>
                    </td>
                    <td v-if="isEditMode">
                        <input type="button" :class="css.matrixdynamic.button" :value="question.removeRowText" @click="removeRowClick(row)" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionMatrixDynamicModel} from '../question_matrixdynamic'

    @Component
    export default class MatrixDynamic extends Question<QuestionMatrixDynamicModel> {
        removeRowClick(row) {
            var rows = this.question.cachedVisibleRows;
            var index = rows.indexOf(row);
            if (index > -1) {
                this.question.removeRow(index);
            }
        }
    }
    Vue.component("survey-matrixdynamic", MatrixDynamic)
</script>