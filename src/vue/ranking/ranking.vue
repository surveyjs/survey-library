<template>
  <div :class="question.rootClass">
    <survey-ranking-item
      v-for="(item, index) in question.rankingChoices"
      :key="item.value + '-' + index + '-item'"
      :class="question.getItemClass(item)"
      :text="item.locText"
      :index="question.getNumberByIndex(index)"
      :handleKeydown="question.handleKeydown"
      :cssClasses="question.cssClasses"
    ></survey-ranking-item>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "../question";
import { QuestionRankingModel } from "survey-core";

@Component
export class Ranking extends QuestionVue<QuestionRankingModel> {}

Vue.component("survey-ranking", Ranking);
export default Ranking;
</script>
