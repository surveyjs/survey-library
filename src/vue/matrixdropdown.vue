<template>
    <div :style="{overflowX: question.horizontalScroll? 'scroll': ''}">
        <survey-matrixtable :question="question" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMatrixDropdownModel } from "../question_matrixdropdown";
import { MatrixDropdownRowModelBase } from "../question_matrixdropdownbase";

@Component
export class MatrixDropdown extends QuestionVue<QuestionMatrixDropdownModel> {}

Vue.component("survey-matrixdropdown", MatrixDropdown);
export default MatrixDropdown;
</script>
