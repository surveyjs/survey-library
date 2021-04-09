<template>
  <div :class="question.cssClasses.tableWrapper">
    <fieldset v-if="!verticalMode()">
      <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
      <table :class="question.cssClasses.root">
        <thead v-if="question.showHeader">
          <tr>
            <td v-if="question.allowRowsDragAndDrop"></td>
            <td v-show="question.hasRows"></td>
            <th
              v-for="(column, columnIndex) in question.visibleColumns"
              :key="columnIndex"
              :class="question.cssClasses.headerCell"
            >
              <survey-string :locString="column.locText" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in question.visibleRows"
            :key="'row-' + row.name + '-' + rowIndex"
            :class="row.rowClasses"
          >
            <drag-drop-td
              :question="question"
              v-if="question.allowRowsDragAndDrop"
            />
            <td :class="question.cssClasses.cell" v-show="question.hasRows">
              <survey-string :locString="row.locText" />
            </td>
            <td
              v-if="question.hasCellText"
              v-for="(column, columnIndex) in question.visibleColumns"
              :key="columnIndex"
              :class="question.getItemClass(row, column)"
              v-on:click="cellClick(row, column)"
            >
              <survey-string
                :locString="question.getCellDisplayLocText(row.name, column)"
              ></survey-string>
            </td>
            <td
              v-if="!question.hasCellText"
              v-for="(column, columnIndex) in question.visibleColumns"
              :key="columnIndex"
              :title="column.locText.renderedHtml"
              :class="question.cssClasses.cell"
              v-on:click.self="cellClick(row, column)"
            >
              <label :class="question.getItemClass(row, column)">
                <input
                  :type="question.cellType ? 'checkbox' : 'radio'"
                  :class="question.cssClasses.itemValue + itemClass()"
                  :name="row.fullName"
                  :value="column.value"
                  :checked="question.isItemChecked(row, column)"
                  v-on:input.prevent="cellClick(row, column)"
                  :disabled="question.isReadOnly"
                  :id="question.inputId + '_' + row.name + '_' + columnIndex"
                  v-bind:aria-required="question.isRequired"
                  :aria-label="question.locTitle.renderedHtml"
                />
                <span v-if="question.cellType != 'checkbox'" :class="question.cssClasses.materialDecorator">
                  <svg 
                    :class="question.cssClasses.itemDecorator"
                    viewBox="-12 -12 24 24"
                  >
                    <circle r="6" cx="0" cy="0" />
                  </svg>
                <span  class="circle"></span>
                <span  class="check"></span>
                </span>

                <span v-if="question.cellType == 'checkbox'" :class="question.cssClasses.checkboxMaterialDecorator">
                  <svg
                    viewBox="0 0 24 24"
                    :class="question.cssClasses.itemCheckboxDecorator"
                  >
                    <path d="M5,13l2-2l3,3l7-7l2,2l-9,9L5,13z" />
                  </svg>
                  <span class="check"></span>
                </span>

                <span :style="{ display: 'none' }">{{
                  question.locTitle.renderedHtml
                }}</span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>

    <fieldset v-if="verticalMode()">
      <legend v-bind:aria-label="question.locTitle.renderedHtml"></legend>
      <table :class="question.cssClasses.root">
        <!--
            header column
        --->
        <thead v-if="question.showHeader">
          <tr>
            <td v-if="question.allowRowsDragAndDrop"></td>
            <td v-show="question.hasRows"></td>
            <th
              v-for="(row, rowIndex) in question.visibleRows"
              :key="rowIndex"
              :class="question.cssClasses.headerCell"
            >
              <survey-string :locString="row.locText" />
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- 
            every row is a choices, every column is a subject
          -->
          <tr
            v-for="(row, rowIndex) in question.visibleColumns"
            :key="'row-' + row.name + '-' + rowIndex"
            :class="row.rowClasses"
          >
            <drag-drop-td
              :question="question"
              v-if="question.allowRowsDragAndDrop"
            />
            <td :class="question.cssClasses.cell" v-show="question.hasRows">
              <survey-string :locString="row.locText" />
            </td>
            <!--
                do not care about hasCellCase
            --->
            <td
              v-if="question.hasCellText"
              v-for="(column, columnIndex) in question.visibleColumns"
              :key="columnIndex"
              :class="question.getItemClass(row, column)"
              v-on:click="cellClick(row, column)"
            >
              <survey-string
                :locString="question.getCellDisplayLocText(row.name, column)"
              ></survey-string>
            </td>
            <td
              v-if="!question.hasCellText"
              v-for="(column, columnIndex) in question.visibleRows"
              :key="columnIndex"
              :headers="column.locText.renderedHtml"
              :class="question.cssClasses.cell"
              v-on:click.self="cellClick(column, row)"
            >
              <label :class="question.getItemClass(column, row)">
                <input
                  :type="question.cellType ? 'checkbox' : 'radio'"
                  :class="question.cssClasses.itemValue + itemClass()"
                  :name="column.fullName"
                  :value="row.value"
                  v-on:input.prevent="cellClick(column, row)"
                  :disabled="question.isReadOnly"
                  :id="question.inputId + '_' + column.name + '_' + rowIndex"
                  v-bind:aria-required="question.isRequired"
                  :aria-label="question.locTitle.renderedHtml"
                />

                  <span v-if="question.cellType != 'checkbox'" :class="question.cssClasses.materialDecorator">
                  <svg 
                    :class="question.cssClasses.itemDecorator"
                    viewBox="-12 -12 24 24"
                  >
                    <circle r="6" cx="0" cy="0" />
                  </svg>
                <span  class="circle"></span>
                <span  class="check"></span>
                </span>

                <span v-if="question.cellType == 'checkbox'" :class="question.cssClasses.checkboxMaterialDecorator">
                  <svg
                    viewBox="0 0 24 24"
                    :class="question.cssClasses.itemCheckboxDecorator"
                  >
                    <path d="M5,13l2-2l3,3l7-7l2,2l-9,9L5,13z" />
                  </svg>
                  <span class="check"></span>
                </span>
                <span :style="{ display: 'none' }">{{
                  question.locTitle.renderedHtml
                }}</span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMatrixModel } from "survey-core";

@Component
export class Matrix extends QuestionVue<QuestionMatrixModel> {
  wide = window.innerWidth > 600;

  mounted() {
    window.addEventListener("resize", this.onResize);
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  }

  cellClick(row: any, column: any) {
    if (this.question.isReadOnly) return;
    if (this.question.cellType == "checkbox") {
      this.checkboxCellClick(row, column);
    } else {
      row.value = column.value;
    }
  }

  checkboxCellClick(row: any, column: any) {
    if (row.value) {
      if (row.value.includes(column.value)) {
        // try to remove value from row.value
        row.value = row.value.filter((item: any) => item != column.value);
      } else {
        row.value = row.value.concat([column.value]);
      }
    } else {
      row.value = [column.value];
    }
  }
  onResize() {
    this.wide = window.innerWidth > 600;
  }
  verticalMode() {
    return this.wide && this.question.layout == "vertical";
  }

  itemClass() {
    return this.question.cellType == "checkbox"
      ? " sv-checkbox__control"
      : " sv-radio__control";
  }

}

Vue.component("survey-matrix", Matrix);
export default Matrix;
</script>
