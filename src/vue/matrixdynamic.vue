<template>
    <div :style="{overflowX: question.horizontalScroll? 'scroll': ''}">
        <table :class="css.matrixdynamic.root">
            <thead>
                <tr>
                    <th v-for="column in question.columns" :style="{ minWidth: question.getColumnWidth(column) }"><survey-string :locString="column.locTitle"/></th>
                    <th v-if="!question.isReadOnly"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows">
                    <td v-for="cell in row.cells">
                        <survey-errors :question="cell.question" :css="css"/>
                        <component :is="getWidgetComponentName(cell.question)" :question="cell.question" :css="css"/>
                    </td>
                    <td v-if="!question.isReadOnly">
                        <input type="button" v-if="question.canRemoveRow" :class="css.matrixdynamic.button" :value="question.removeRowText" @click="removeRowClick(row)" />
                    </td>
                </tr>
            </tbody>
        </table>
        <input type="button" v-if="!question.isReadOnly && question.canAddRow" :class="css.matrixdynamic.button" :value="question.addRowText" @click="addRowClick"/>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from 'vue-property-decorator'
    import {default as Question} from './question'
    import {Question as QuestionModel} from '../question'
    import {QuestionMatrixDynamicModel} from '../question_matrixdynamic'
    import {MatrixDropdownRowModelBase} from '../question_matrixdropdownbase'

    @Component
    export default class MatrixDynamic extends Question<QuestionMatrixDynamicModel> {
        get rows() {
            return this.question.visibleRows;
        }
        getWidgetComponentName(element: QuestionModel) {
            if(element.customWidget) {
                return element.customWidget.name;
            }
            return 'survey-' + element.getType();
        }
        removeRowClick(row) {
            var rows = this.question.visibleRows;
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
