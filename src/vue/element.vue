<template>
  <div :class="!element.isPanel ? element.getRootCss() : null">
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
    <div
      :class="getContentClass(element)"
      v-show="element.isPanel || !element.isCollapsed"
    >
      <survey-errors
        v-if="!element.isPanel && hasErrorsOnTop && !element.isErrorsModeTooltip"
        :element="element"
        :location="'top'"
      />
      <component
        :is="getComponentName(element)"
        :question="element"
        :css="css"
      />
      <div v-if="element.hasComment" :class="element.cssClasses.formGroup">
        <div>{{ element.commentText }}</div>
        <survey-other-choice :commentClass="css.comment" :question="element" />
      </div>
      <survey-errors
        v-if="!element.isPanel && hasErrorsOnBottom && !element.isErrorsModeTooltip"
        :element="element"
        :location="'bottom'"
      />
        <survey-errors
        v-if="!element.isPanel && element.isErrorsModeTooltip && element.hasParent"
        :element="element"
        :location="'tooltip'"
      />
      <div
        v-if="!element.isPanel && element.hasDescriptionUnderInput"
        :class="element.cssClasses.descriptionUnderInput"
      >
        <survey-string :locString="element.locDescription" />
      </div>
    </div>
    <survey-element-header
      v-if="!element.isPanel && element.hasTitleOnBottom"
      :element="element"
      :css="css"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Base, SurveyModel, Question, SurveyElement } from "survey-core";
import { BaseVue } from "./base";

@Component
export class SurveyElementVue extends BaseVue {
  @Prop() css: any;
  @Prop() survey: SurveyModel;
  @Prop() element: SurveyElement;
  protected getModel(): Base {
    return this.element;
  }
  getComponentName(element: Question) {
    if (element.customWidget) return "survey-customwidget";
    if (element.getType() === "panel" || element.isDefaultRendering()) {
      return "survey-" + element.getTemplate();
    }
    return element.getComponentName();
  }
  getContentClass(element: Question) {
    return element.cssContent;
  }
  get hasErrorsOnTop() {
    return !this.element.isPanel && this.survey.questionErrorLocation === "top";
  }
  get hasErrorsOnBottom() {
    return (
      !this.element.isPanel && this.survey.questionErrorLocation === "bottom"
    );
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
