<template>
  <div :class="getRootClass(element)">
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
        v-if="!element.isPanel && hasErrorsOnTop"
        :question="element"
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
        v-if="!element.isPanel && hasErrorsOnBottom"
        :question="element"
        :location="'bottom'"
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
import { SurveyModel } from "survey-core";
import { IElement } from "survey-core";
import { Question } from "survey-core";
@Component
export class SurveyElementVue extends Vue {
  @Prop() css: any;
  @Prop() survey: SurveyModel;
  @Prop() element: IElement;
  getComponentName(element: Question) {
    if (element.customWidget) return "survey-customwidget";
    if (element.getType() === "panel" || element.isDefaultRendering()) {
      return "survey-" + element.getTemplate();
    }
    return element.getComponentName();
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
      (<Question>this.element).afterRender(this.$el as HTMLElement);
    }
  }
}
Vue.component("survey-element", SurveyElementVue);
export default SurveyElementVue;
</script>
