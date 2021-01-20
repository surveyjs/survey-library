<template>
  <div class="sv-title-actions">
    <span class="sv-title-actions__title">
      <survey-question-title-content
        :element="element"
        :css="css"
      ></survey-question-title-content>
    </span>
    <sv-action-bar
      class="sv-title-actions__bar"
      params="items: items"
    ></sv-action-bar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop } from "vue-property-decorator";
import { ISurveyElement } from "../../../base";
import { RendererFactory } from "../../../rendererFactory";

@Component
class TitleActions extends Vue {
  @Prop element: ISurveyElement;
  items: Array<any>;
  constructor() {
    super();
    this.items = this.element.getTitleActions();
  }
}

RendererFactory.Instance.registerRenderer(
  "element",
  "title-actions",
  "sv-title-actions"
);

Vue.component("sv-default-title", TitleActions);
export default TitleActions;
</script>
