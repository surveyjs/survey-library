<template>
    <div :key="errorKey">
      <span
        :class="cssClasses ? cssClasses.error.icon || undefined : 'panel-error-icon'"
        aria-hidden="true"
      ></span>
      <span
        :class="cssClasses ? cssClasses.error.item || undefined: 'panel-error-item'"
      >
        <survey-string :locString="error.locText" />
      </span>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { SurveyError } from "survey-core";

@Component
export class QuestionError extends Vue {
  @Prop() errorKey: string;
  @Prop() error: SurveyError;
  @Prop() cssClasses: any;
  @Prop() element: any;
  constructor() {
    super();
  }
}

Vue.component("sv-question-error", QuestionError);

export default QuestionError;
</script>
