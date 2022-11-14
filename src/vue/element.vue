<template>
  <div :class="!element.isPanel ? element.getRootCss() : null" 
        v-if="row.isNeedRender"
        v-on:focusin="element.focusIn()"
        :id="element.id"
        :role="element.ariaRole"
        :aria-required="element.ariaRequired"
        :aria-invalid="element.ariaInvalid"
        :aria-labelledby="element.hasTitle ? element.ariaTitleId : null"
        :data-name="element.name">
    <survey-errors
      v-if="!element.isPanel && element.showErrorsAboveQuestion"
      :element="element"
      :location="'top'"
    />
    <survey-element-header
      v-if="!element.isPanel && element.hasTitleOnLeftTop"
      :element="element"
      :css="css"
    />
    <div
      :class="getContentClass(element) || undefined"
      v-show="element.isPanel || !element.isCollapsed"  role="presentation"
    >
      <survey-errors
        v-if="hasErrorsOnTop"
        :element="element"
        :location="'top'"
      />
      <component
        :is="getComponentName(element)"
        v-if="element.isPanel || !element.isCollapsed"
        :question="element"
        :css="css"
      />
      <div v-if="element.hasComment" :class="element.cssClasses.formGroup">
        <div>{{ element.commentText }}</div>
        <survey-other-choice :commentClass="css.comment" :question="element" />
      </div>
      <survey-errors
        v-if="hasErrorsOnBottom"
        :element="element"
        :location="'bottom'"
      />
      <survey-errors
        v-if="!element.isPanel && element.isErrorsModeTooltip"
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
    <survey-errors
      v-if="!element.isPanel && element.showErrorsBelowQuestion"
      :element="element"
      :location="'bottom'"
    />
  </div>
  
  <component
  v-else-if="!!element.skeletonComponentName"
  :is="element.skeletonComponentName"
  :element="element"
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
    return !this.element.isPanel && (<Question>this.element).showErrorOnTop;
  }
  get hasErrorsOnBottom() {
    return !this.element.isPanel && (<Question>this.element).showErrorOnBottom;
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
