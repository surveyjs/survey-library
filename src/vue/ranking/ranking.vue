<template>
  <div :class="question.rootClass">
    <survey-ranking-item
      v-for="(item, index) in question.rankingChoices"
      :key="item.value + '-' + index + '-item'"
      :class="question.getItemClass(item)"
      :text="item.locText"
      :index="index"
      :handleKeydown="question.handleKeydown"
      :cssClasses="question.cssClasses"
    ></survey-ranking-item>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "../question";
import { QuestionRankingModel } from "../../question_ranking";

@Component
export class Ranking extends QuestionVue<QuestionRankingModel> {
  onMounted() {
    if (this.question) {
      this.question.afterRenderQuestionElement(this.$el);
    }
    this.question.syncNumbers();
  }
  updated() {
    this.question.syncNumbers();
  }
}

Vue.component("survey-ranking", Ranking);
export default Ranking;
</script>
