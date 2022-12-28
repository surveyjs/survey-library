<template>
  <div :class="!element.isPanel ? element.getRootCss() : null" 
        v-if="row.isNeedRender"
        v-on:focusin="element.focusIn()"
        :id="element.id"
        :role="element.ariaRole"
        :aria-required="element.ariaRequired"
        :aria-invalid="element.ariaInvalid"
        :aria-labelledby="element.ariaLabelledBy"
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
        <survey-question-comment :commentClass="css.comment" :question="element" />
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
import { Base, SurveyModel, Question, SurveyElement, QuestionRowModel } from "survey-core";
import { defineSurveyComponent } from "./base";

export default defineSurveyComponent({
  // eslint-disable-next-line
  name: "survey-element",
  props: {
    css: Object,
    survey: SurveyModel,
    element: SurveyElement,
    row: QuestionRowModel,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.element; },
      getComponentName: (element: Question) => {
        if (element.customWidget) return "survey-customwidget";
        if (element.getType() === "panel" || element.isDefaultRendering()) {
          return "survey-" + element.getTemplate();
        }
        return element.getComponentName();
      },
      getContentClass: (element: Question) => {
        return element.cssContent;
      }
    }
  },
  computed: {
    hasErrorsOnTop() {
      return !this.element.isPanel && (<Question>this.element).showErrorOnTop;
    },
    hasErrorsOnBottom() {
      return !this.element.isPanel && (<Question>this.element).showErrorOnBottom;
    }
  },
  mounted() {
    if (!this.element.isPanel) {
      (<Question>this.element).afterRender(this.$el as HTMLElement);
    }
  }
});

//export default SurveyElementVue;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>