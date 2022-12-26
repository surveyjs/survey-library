<template>
    <survey-matrixtable :question="question" />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMatrixDropdownModel } from "survey-core";
import { MatrixDropdownRowModelBase } from "survey-core";

@Component
export class MatrixDropdown extends QuestionVue<QuestionMatrixDropdownModel> {}

Vue.component("survey-matrixdropdown", MatrixDropdown);
export default MatrixDropdown;
</script>
