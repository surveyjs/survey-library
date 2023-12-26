<template>
  <label v-if="!cell.isErrorsCell" :class="question.getItemLabelCss(item)">
    <span :class="question.getItemTitleCss()"
      :style="{ minWidth: question.itemTitleWidth, width: question.itemTitleWidth }">
      <span v-if="item.editor.isRequireTextBeforeTitle ||
        item.editor.isRequireTextOnStart
        " :class="question.cssClasses.requiredText">{{ item.editor.requiredText }}</span>
      <survey-string :locString="item.locTitle" />
      <span v-if="item.editor.isRequireTextAfterTitle">&nbsp;</span>
      <span v-if="item.editor.isRequireTextAfterTitle" aria-hidden="true" :class="question.cssClasses.requiredText">{{
        item.editor.requiredText }}</span>
    </span>
    <div :key="item.editor.id" :class="question.getItemCss()" v-on:focusin="item.focusIn()">
      <component :is="getComponentName(item.editor)" :question="item.editor" />
    </div>
  </label>
  <survey-errors v-else :element="item.editor" />
</template>

<script lang="ts">

import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionMultipleTextModel, Question, MultipleTextCell } from "survey-core";
import BaseVue from "./base";
import { getComponentName } from "./question";

@Component
export class MultipleTextItem extends BaseVue {
  @Prop()
  question: QuestionMultipleTextModel;
  @Prop()
  cell: MultipleTextCell;

  getModel() {
    return this.cell.item.editor;
  }
  public get item() {
    return this.cell.item;
  }
  getComponentName(question: Question) {
    return getComponentName(question);
  }
}
Vue.component("survey-multipletext-item", MultipleTextItem);
export default MultipleTextItem;
</script>
