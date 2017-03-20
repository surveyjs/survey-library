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
                <tr v-for="row in rows">
                    <td v-for="cell in row.cells">
                        <survey-errors :question="cell.question" :css="css"/>
                        <component :is="'survey-' + cell.question.getType()" :question="cell.question" :isEditMode="isEditMode" :css="css"/>
                    </td>
                    <td v-if="isEditMode">
                        <input type="button" :class="css.matrixdynamic.button" :value="question.removeRowText" @click="removeRowClick(row)" />
                    </td>
                </tr>
            </tbody>
        </table>
        <input type="button" v-if="isEditMode" :class="css.matrixdynamic.button" :value="question.addRowText" @click="addRowClick"/>
    </div>
</template>

<script lang="ts">
    import * as Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {QuestionMatrixDynamicModel} from '../question_matrixdynamic'
    import {MatrixDropdownRowModelBase} from '../question_matrixdropdownbase'

    @Component
    export default class MatrixDynamic extends Question<QuestionMatrixDynamicModel> {
        get rows() {
            return this.question.visibleRows;
        }
        removeRowClick(row) {
            var rows = this.question.cachedVisibleRows;
            var index = rows.indexOf(row);
            if (index > -1) {
                this.question.removeRow(index);
            }
        }
        addRowClick() {
            this.question.addRow();
        }
    }
    Vue.component("survey-matrixdynamic", MatrixDynamic)
</script>