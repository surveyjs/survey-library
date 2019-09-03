<template>
  <div :class="getRootClass(element)">
    <div :class="getHeaderClass(element)">
      <div :class="getTitleClass(element)" title="element.locTitle">
        <h5 v-if="element.hasTitle" :class="element.cssClasses.title">
          <span
            v-if="element.no"
            style="position: static;"
            :class="element.cssClasses.number"
          >{{element.no}}</span>
          <span v-if="element.no" style="position: static;">.&nbsp</span>
          <survey-string :locString="element.locTitle" />
        </h5>
      </div>
      <div v-if="!element.locDescription.isEmpty" :class="element.cssClasses.description">
        <survey-string :locString="element.locDescription" />
      </div>
    </div>
    <div :class="getContentClass(element)">
      <survey-errors v-if="hasErrorsOnTop" :question="element" :location="'top'" />
      <component :is="getWidgetComponentName(element)" :question="element" :css="css" />
      <div v-if="element.hasComment">
        <div>{{element.commentText}}</div>
        <survey-other-choice :commentClass="css.comment" :question="element" />
      </div>
      <survey-errors v-if="hasErrorsOnBottom" :question="element" :location="'bottom'" />

      <div v-if="element.hasTitleOnBottom" :class="getTitleClass(element)" title="element.locTitle">
        <h5 :class="element.cssClasses.title">
          <span
            v-if="element.no"
            style="position: static;"
            :class="element.cssClasses.number"
          >{{element.no}}</span>
          <span v-if="element.no" style="position: static;">.&nbsp</span>
          <survey-string :locString="element.locTitle" />
        </h5>
      </div>
      <div v-if="!element.locDescription.isEmpty" v-show="element.hasTitleOnBottom">
        <survey-string :locString="element.locDescription" />
      </div>
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
  getRootClass(element: Question) {
    var rootClass = "";
    if (!!element.cssMainRoot) {
      rootClass += element.cssMainRoot;
    }

    if (element.cssClasses.small && !element.width) {
      rootClass += " " + element.cssClasses.small;
    }

    return rootClass;
  }
  getTitleClass(element: Question) {
    var cssClasses = element.cssClasses;
    var titleClass = cssClasses.titleContainer;

    if (!element.isPanel && !element.isEmpty()) {
      titleClass += " " + cssClasses.titleContainerAnswer;
    }

    if (!element.isPanel && element.errors.length > 0) {
      titleClass += " " + cssClasses.titleContainerError;
    }
    return titleClass;
  }
  getHeaderClass(element: Question) {
    var headerClass = element.cssClasses.header;
    if (element.hasTitleOnLeft) {
      headerClass += " " + element.cssClasses.headerLeft;
    }
    return headerClass;
  }
  getContentClass(element: Question) {
    var contentClass = element.cssClasses.content;
    if (element.hasTitleOnLeft) {
      contentClass += " " + element.cssClasses.contentLeft;
    }
    return contentClass;
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