<template>
    <div :class="getQuestionClass(element)">
        <div v-if="element.hasTitleOnLeftTop" :class="element.hasTitleOnLeft ? 'title-left' : ''">
            <h5 v-if="element.hasTitle" :class="element.cssClasses.title"><survey-string :locString="element.locTitle"/></h5>
            <div v-if="!element.locDescription.isEmpty" :class="element.cssClasses.description"><survey-string :locString="element.locDescription"/></div>
        </div>
        <div :class="element.hasTitleOnLeft ? 'content-left' : ''">
            <survey-errors v-if="hasErrorsOnTop" :question="element"/>
            <component :is="getWidgetComponentName(element)" :question="element" :css="css"/>
            <div v-if="element.hasComment">
                <div>{{element.commentText}}</div>
                <survey-other-choice :commentClass="css.comment" :question="element"/>
            </div>
            <survey-errors v-if="hasErrorsOnBottom" :question="element"/>
            <h5 v-if="element.hasTitleOnBottom" :class="element.cssClasses.title"><survey-string :locString="element.locTitle"/></h5>
            <div v-if="!element.locDescription.isEmpty" v-show="element.hasTitleOnBottom"><survey-string :locString="element.locDescription"/></div>
        </div>
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
  getQuestionClass(element: Question) {
    if (!!element.errors && element.errors.length > 0) {
      return this.css.question.hasError;
    }
    return "";
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
    if (this.survey && !this.element.isPanel) {
      this.survey.afterRenderQuestion(<IQuestion>this.element, this.$el);
    }
  }
}
Vue.component("survey-element", SurveyElementVue);
export default SurveyElementVue;
</script>
