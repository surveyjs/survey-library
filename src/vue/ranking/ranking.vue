<template>
  <div :class="question.rootClass" ref="domNode">
    <survey-ranking-item
      v-for="(item, index) in question.visibleChoices"
      :key="item.value"
      :class="question.getItemClass(item)"
      :text="item.text"
      :index="index"
      v-on:keydown="question.handleKeydown"
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
    this.question.initSortable(<any>this.$refs.domNode);
  }
  onDestroyed() {
    this.question.sortableInst.destroy();
  }
}
Vue.component("survey-ranking", Ranking);
export default Ranking;
</script>
