<template>
  <div :class="getQuestionClass(element)">
    <div v-if="element.hasTitleOnLeftTop" :class="element.hasTitleOnLeft ? 'title-left' : ''">
      <h5 v-if="element.hasTitle" :class="element.cssClasses.title">
        <survey-string :locString="element.locTitle"/>
      </h5>
      <div v-if="!element.locDescription.isEmpty" :class="element.cssClasses.description">
        <survey-string :locString="element.locDescription"/>
      </div>
    </div>
    <div :class="element.hasTitleOnLeft ? 'content-left' : ''">
      <survey-errors v-if="hasErrorsOnTop" :question="element" :location="'top'"/>
      <component :is="getWidgetComponentName(element)" :question="element" :css="css"/>
      <div v-if="element.hasComment">
        <div>{{element.commentText}}</div>
        <survey-other-choice :commentClass="css.comment" :question="element"/>
      </div>
      <survey-errors v-if="hasErrorsOnBottom" :question="element" :location="'bottom'"/>
      <h5 v-if="element.hasTitleOnBottom" :class="element.cssClasses.title">
        <survey-string :locString="element.locTitle"/>
      </h5>
      <div v-if="!element.locDescription.isEmpty" v-show="element.hasTitleOnBottom">
        <survey-string :locString="element.locDescription"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "../survey";
import { IElement, IQuestion, ISurvey } from "../base";
import { Question } from "../question";

@Component
export class SurveyElementVue extends Vue {
  @Prop css: any;
  @Prop question: Question;

  get widgetComponentName() {
    if (this.question.customWidget) {
      return "survey-customwidget";
    }
    return "survey-" + this.question.getTemplate();
  }
  get questionRootClass() {
    var res = this.css.question.mainRoot;
    if (!!this.survey && this.survey.questionTitleLocation === "left") {
      return res + " sv_qstn_left";
    }
    if (!!this.question.errors && this.question.errors.length > 0) {
      res += " " + this.css.question.hasError;
    }
    return res;
  }
  get survey(): ISurvey {
    return !!this.question ? this.question.survey : null;
  }
  get hasErrorsOnTop() {
    return !!this.survey && this.survey.questionErrorLocation === "top";
  }
  get hasErrorsOnBottom() {
    return !!this.survey && this.survey.questionErrorLocation === "bottom";
  }
  mounted() {
    if (!!this.survey) {
      this.survey.afterRenderQuestion(<IQuestion>this.question, this.$el);
    }
  }
}
Vue.component("survey-element", SurveyElementVue);
export default SurveyElementVue;
</script>
