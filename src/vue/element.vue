<template>
  <div :class="!element.isPanel ? element.getRootCss() : null"
        v-if="row.isNeedRender"
        ref="root"
        v-on:focusin="element.focusIn()"
        :id="element.id"
        :role="element.ariaRole"
        :aria-required="element.ariaRequired"
        :aria-invalid="element.ariaInvalid"
        :aria-labelledby="element.ariaLabelledBy"
        :aria-describedby="element.ariaDescribedBy"
        :aria-expanded="element.ariaExpanded"
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
      <div v-if="element.hasComment" :class="element.getCommentAreaCss()">
        <div>
          <survey-string :locString="element.locCommentText" />
        </div>
        <survey-question-comment :commentClass="css.comment" :question="element" />
      </div>
      <survey-errors
        v-if="hasErrorsOnBottom"
        :element="element"
        :location="'bottom'"
      />
      <div
        v-if="!element.isPanel && element.hasDescriptionUnderInput"
        :class="element.cssClasses.descriptionUnderInput"
        :id="element.ariaDescriptionId"
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
  ref="root"
  :is="element.skeletonComponentName"
  :element="element"
  :css="css"
></component>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Base, SurveyModel, Question, QuestionRowModel } from "survey-core";
import { getComponentName } from "./question";
import { BaseVue } from "./base";

@Component
export class SurveyElementVue extends BaseVue {
  @Prop() css: any;
  @Prop() survey: SurveyModel;
  @Prop() element: any;
  @Prop() row: QuestionRowModel;
  protected getModel(): Base {
    return this.element;
  }
  getComponentName(element: Question) {
    return getComponentName(element);
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
  previousElement: HTMLElement;
  afterRender(el: HTMLElement) {
    if (!this.element.isPanel && this.previousElement !== el && el && el instanceof HTMLElement) {
      (<Question>this.element).afterRender(el);
    }
    this.previousElement = el;
  }
  onUpdated() {
    this.afterRender(this.$refs.root as HTMLElement);
  }
  mounted(): void {
    this.afterRender(this.$refs.root as HTMLElement);
  }
  destroyed(): void {
    this.previousElement = undefined as any;
  }
}
Vue.component("survey-element", SurveyElementVue);
export default SurveyElementVue;
</script>
