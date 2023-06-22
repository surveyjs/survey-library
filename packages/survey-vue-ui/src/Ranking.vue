<template>
  <div :class="question.rootClass">
    <survey-ranking-item 
      v-if="!question.selectToRankEnabled"
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
import { QuestionRankingModel } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue],
  name: "survey-ranking",
  props: {
    question: QuestionRankingModel,
  },
  data: (vm: any) => {
    return {
      getModel: () => { return vm.question; },
      getNumberByIndex(index: any):number {
        return this.question.getNumberByIndex(index)
      }
    }
  },
});
</script>
