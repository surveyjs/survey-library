<template>
  <div :class="question.cssClasses.rootDropdown">
      <select
        :id="question.inputId"
        v-model="question.value"
        :autocomplete="question.autoComplete"
        :class="question.getControlClass()"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
        :required="question.isRequired"
      >
        <option :value="undefined">{{ question.optionsCaption }}</option>
        <option v-for="item in question.visibleRateValues" :value="item.value" :disabled="!item.isEnabled">{{ item.text }}</option>
      </select>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionRatingModel, RendererFactory } from "survey-core";

@Component
export class RatingDropdown extends QuestionVue<QuestionRatingModel> {
}
RendererFactory.Instance.registerRenderer(
  "rating",
  "dropdown",
  "sv-rating-dropdown"
);
Vue.component("sv-rating-dropdown", RatingDropdown);
export default RatingDropdown;
</script>
