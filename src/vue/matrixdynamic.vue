<template>
    <div :style="{overflowX: question.horizontalScroll? 'scroll': ''}">
        <survey-matrixtable :question="question" />
        <div :class="question.cssClasses.footer">
            <input type="button" v-if="!question.isReadOnly && question.canAddRow" :class="question.cssClasses.button + ' ' + question.cssClasses.buttonAdd" :value="question.addRowText" @click="addRowClick"/>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";

@Component
export class MatrixDynamic extends QuestionVue<QuestionMatrixDynamicModel> {
  addRowClick() {
    this.question.addRow();
  }
}
Vue.component("survey-matrixdynamic", MatrixDynamic);
export default MatrixDynamic;
</script>
