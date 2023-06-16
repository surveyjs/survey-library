<template>
  <div :class="question.rootClass">
    <survey-ranking-item v-if="!question.selectToRankEnabled"
      v-for="(item, index) in (question.rankingChoices)"
      :key="item.value + '-' + index + '-item'"
      :class="question.getItemClass(item)"
      :text="item.locText"
      :index="index"
      :indexText="getNumberByIndex(index)"
      :cssClasses="question.cssClasses"
      :question="question"
      :item="item"
    ></survey-ranking-item>

    <div v-if="question.selectToRankEnabled" :class='question.getContainerClasses("from")' data-ranking="from-container">
      <survey-ranking-item
        v-for="(item, index) in (question.unRankingChoices)"
        :key="item.value + '-' + index + '-item'"
        :class="question.getItemClass(item)"
        :text="item.locText"
        :index="index"
        :indexText="getNumberByIndex(index)"
        :cssClasses="question.cssClasses"
        :question="question"
        :item="item"
        :unrankedItem=true
      ></survey-ranking-item>

      <div v-if="question.unRankingChoices.length === 0" :class="question.cssClasses.containerPlaceholder"> {{question.selectToRankFromContainerPlaceholder}} </div>
    </div>

    <div v-if="question.selectToRankEnabled" :class="question.cssClasses.containersDivider"></div>

    <div v-if="question.selectToRankEnabled" :class='question.getContainerClasses("to")' data-ranking="to-container">
      <survey-ranking-item
        v-for="(item, index) in (question.rankingChoices)"
        :key="item.value + '-' + index + '-item'"
        :class="question.getItemClass(item)"
        :text="item.locText"
        :index="index"
        :indexText="getNumberByIndex(index)"
        :cssClasses="question.cssClasses"
        :question="question"
        :item="item"
      ></survey-ranking-item>

      <div v-if="question.rankingChoices.length === 0" :class="question.cssClasses.containerPlaceholder">{{question.selectToRankToContainerPlaceholder}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { default as QuestionVue } from "../question";
import { QuestionRankingModel } from "survey-core";

@Component
export class Ranking extends QuestionVue<QuestionRankingModel> {
  getNumberByIndex(index: any) {
    return this.question.getNumberByIndex(index)
  }
}

Vue.component("survey-ranking", Ranking);
export default Ranking;
</script>
