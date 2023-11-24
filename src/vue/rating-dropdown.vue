<template>
  <div :class="question.cssClasses.rootDropdown">
      <sv-dropdown :question="question" ></sv-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionRatingModel, RendererFactory } from "survey-core";

export * from "./components/rating/rating-dropdown-item.vue";

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
