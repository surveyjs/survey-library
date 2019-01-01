<template>
  <div :class="questionRootClass">
    <div v-if="question.hasTitleOnLeftTop" :class="question.hasTitleOnLeft ? 'title-left' : ''">
      <h5 v-if="question.hasTitle" :class="question.cssClasses.title">
        <survey-string :locString="question.locTitle"/>
      </h5>
      <div v-if="!question.locDescription.isEmpty" :class="question.cssClasses.description">
        <survey-string :locString="question.locDescription"/>
      </div>
    </div>
    <div :class="question.hasTitleOnLeft ? 'content-left' : ''">
      <survey-errors v-if="hasErrorsOnTop" :question="question"/>
      <component :is="widgetComponentName" :question="question" :css="css"/>
      <div v-if="question.hasComment">
        <div>{{question.commentText}}</div>
        <survey-other-choice :commentClass="css.comment" :question="question"/>
      </div>
      <survey-errors v-if="hasErrorsOnBottom" :question="question"/>
      <h5 v-if="question.hasTitleOnBottom" :class="question.cssClasses.title">
        <survey-string :locString="question.locTitle"/>
      </h5>
      <div v-if="!question.locDescription.isEmpty" v-show="question.hasTitleOnBottom">
        <survey-string :locString="question.locDescription"/>
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
