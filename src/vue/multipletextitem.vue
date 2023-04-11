<template>
  <label :class="question.getItemLabelCss(item)">
    <span :class="question.getItemTitleCss()">
      <span
        v-if="
          item.editor.isRequireTextBeforeTitle ||
          item.editor.isRequireTextOnStart
        "
        :class="question.cssClasses.requiredText"
        >{{ item.editor.requiredText }}</span
      >
      <survey-string :locString="item.locTitle" />
      <span
        v-if="item.editor.isRequireTextAfterTitle"
        :class="question.cssClasses.requiredText"
        >{{ item.editor.requiredText }}</span
      >
    </span>
    <div :key="item.editor.id" :class="question.getItemCss()">
      <survey-errors
        v-if="item.editor.showErrorOnTop"
        :element="item.editor"
        :location="'top'"
      />
      <component
        :is="getComponentName(item.editor)"
        :question="item.editor"
      />
      <survey-errors
        v-if="item.editor.showErrorOnBottom"
        :element="item.editor"
        :location="'bottom'"
      />
    </div>
    <survey-errors
      v-if="item.editor.isErrorsModeTooltip"
      :element="item.editor"
      :location="'tooltip'"
    />
  </label>
</template>

<script lang="ts">

import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { MultipleTextItemModel, Question } from "survey-core";
import { QuestionMultipleTextModel } from "survey-core";
import BaseVue from "./base";
import { getComponentName } from "./question";

@Component
export class MultipleTextItem extends BaseVue {
  @Prop()
  question: QuestionMultipleTextModel;
  @Prop()
  item: MultipleTextItemModel

  getModel() {
    return this.item.editor;
  }
  getComponentName(question: Question) {
    return getComponentName(question);
  }
}
Vue.component("survey-multipletext-item", MultipleTextItem);
export default MultipleTextItem;
</script>
