<template>
  <div role="group" :class="question.cssClasses.buttonGroup">
    <template v-for="(item, index) in question.visibleChoices">
      <sv-button-group-item
        :item="item"
        :question="question"
        :index="index"
        :key="question.inputId + '_' + index"
      ></sv-button-group-item>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import {
  ButtonGroupItemModel,
  ItemValue,
  QuestionSelectBase,
  RendererFactory,
} from "survey-core";
import BaseVue from "src/vue/base";

export * from "./button-group-item.vue";

@Component
export class ButtonGroupViewModel extends BaseVue {
  @Prop() question: QuestionSelectBase;

  getModel(): QuestionSelectBase {
    return this.question;
  }
}

Vue.component("sv-button-group", ButtonGroupViewModel);
export default ButtonGroupViewModel;

RendererFactory.Instance.registerRenderer(
  "radiogroup",
  "button-group",
  "sv-button-group"
);

RendererFactory.Instance.registerRenderer(
  "dropdown",
  "button-group",
  "sv-button-group"
);
</script>
