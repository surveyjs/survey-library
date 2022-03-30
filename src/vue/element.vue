<template>
  <div :class="!element.isPanel ? element.getRootCss() : null" 
        v-if="row.isNeedRender"
        :id="element.id"
        :role="element.ariaRole"
        :aria-required="element.ariaRequired"
        :aria-invalid="element.ariaInvalid"
        :aria-labelledby="element.hasTitle ? element.ariaTitleId : null"
        :data-name="element.name">
    <survey-errors
      v-if="!element.isPanel && element.isErrorsModeTooltip && !element.hasParent"
      :element="element"
      :location="'top'"
    />
    <survey-element-header
      v-if="!element.isPanel && element.hasTitleOnLeftTop"
      :element="element"
      :css="css"
    />
    <survey-element-content
      :element="element"
      :css="css"
      :survey="survey"
    />
    <survey-element-header
      v-if="!element.isPanel && element.hasTitleOnBottom"
      :element="element"
      :css="css"
    />
  </div>
  
  <component
  v-else-if="!!element.skeletonComponentName"
  :is="element.skeletonComponentName"
  :question="element"
  :css="css"
></component>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Base, SurveyModel, Question, SurveyElement, QuestionRowModel } from "survey-core";
import { BaseVue } from "./base";

@Component
export class SurveyElementVue extends BaseVue {
  @Prop() css: any;
  @Prop() survey: SurveyModel;
  @Prop() element: SurveyElement;
  @Prop() row: QuestionRowModel;
  protected getModel(): Base {
    return this.element;
  }
  mounted() {
    if (!this.element.isPanel) {
      (<Question>this.element).afterRender(this.$el as HTMLElement);
    }
  }

}
Vue.component("survey-element", SurveyElementVue);
export default SurveyElementVue;
</script>
