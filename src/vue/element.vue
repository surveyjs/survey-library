<template>
  <div :class="getRootClass(element)">
    <survey-element-header v-if="element.hasTitleOnLeftTop" :element="element" />
    <div class="sv-vue-row-additional-div" :class="getContentClass(element)">
      <survey-errors v-if="hasErrorsOnTop" :question="element" :location="'top'" />
      <component :is="getWidgetComponentName(element)" :question="element" :css="css" />
      <div v-if="element.hasComment" :class="element.cssClasses.formGroup">
        <div>{{element.commentText}}</div>
        <survey-other-choice :commentClass="css.comment" :question="element" />
      </div>
      <survey-errors v-if="hasErrorsOnBottom" :question="element" :location="'bottom'" />
      <div
        v-if="element.hasDescriptionUnderInput"
        :class="element.cssClasses.descriptionUnderInput"
      >
        <survey-string :locString="element.locDescription" />
      </div>
    </div>
    <survey-element-header v-if="element.hasTitleOnBottom" :element="element" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "../survey";
import { IElement, IQuestion } from "../base";
import { Question } from "../question";
@Component
export class SurveyElementVue extends Vue {
  @Prop css: any;
  @Prop survey: SurveyModel;
  @Prop element: IElement;
  getWidgetComponentName(element: Question) {
    if (element.customWidget) {
      return "survey-customwidget";
    }
    return "survey-" + element.getTemplate();
  }
  getRootClass(element: Question) {
    let cssRoot = element.cssRoot;
    if (element.isReadOnly) {
      cssRoot += " " + (<any>this.element).cssClasses.disabled;
    }

    return cssRoot;
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
      (<Question>this.element).afterRender(this.$el);
    }
  }
}
Vue.component("survey-element", SurveyElementVue);
export default SurveyElementVue;
</script>