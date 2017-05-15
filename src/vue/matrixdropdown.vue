<template>
    <div :style="{overflowX: question.horizontalScroll? 'scroll': ''}">
        <table :class="css.matrixdropdown.root">
            <thead>
                <tr>
                    <th></th>
                    <th v-for="column in question.columns" :style="{ minWidth: question.getColumnWidth(column) }"><survey-string :locString="column.locTitle"/></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in rows">
                    <td><survey-string :locString="row.locText"/></td>
                    <td v-for="cell in row.cells" :class="css.matrixdropdown.itemValue">
                        <survey-errors :question="question" :css="css"/>
                        <component :is="getWidgetComponentName(cell.question)" :question="cell.question" :css="css"/>
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
    import {Question as QuestionModel} from '../question'
    import {MatrixDropdownRowModelBase} from '../question_matrixdropdownbase'

    @Component
    export default class MatrixDropdown extends Question<QuestionMatrixDropdownModel> {
        get rows() {
            return this.question.visibleRows;
        }

        getWidgetComponentName(element: QuestionModel) {
            if(element.customWidget) {
                return element.customWidget.name;
            }
            return 'survey-' + element.getType();
        }
    }

    Vue.component("survey-matrixdropdown", MatrixDropdown)
</script>
