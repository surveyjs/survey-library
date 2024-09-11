<template>
  <div :class="question.rootClass" ref="root">
    <template v-if="!question.selectToRankEnabled">
      <SvComponent
        v-for="(item, index) in question.renderedRankingChoices"
        :key="item.value + '-' + index + '-item'"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item, index)"
      ></SvComponent>
    </template>

    <div
      v-if="question.selectToRankEnabled"
      :class="question.getContainerClasses('from')"
      data-ranking="from-container"
    >
      <SvComponent
        v-for="(item, index) in question.renderedUnRankingChoices"
        :key="item.value + '-' + index + '-item'"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item, index, true)"
      ></SvComponent>

      <div
        v-if="question.renderedUnRankingChoices.length === 0"
        :class="question.cssClasses.containerPlaceholder"
      >
        <SvComponent
          :is="'survey-string'"
          :locString="question.locSelectToRankEmptyRankedAreaText"
        ></SvComponent>
      </div>
    </div>

    <div
      v-if="question.selectToRankEnabled"
      :class="question.cssClasses.containersDivider"
    ></div>

    <div
      v-if="question.selectToRankEnabled"
      :class="question.getContainerClasses('to')"
      data-ranking="to-container"
    >
      <SvComponent
        v-for="(item, index) in question.renderedRankingChoices"
        :key="item.value + '-' + index + '-item'"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item, index)"
      ></SvComponent>

      <div
        v-if="question.renderedRankingChoices.length === 0"
        :class="question.cssClasses.containerPlaceholder"
      >
        <SvComponent
          :is="'survey-string'"
          :locString="question.locSelectToRankEmptyUnrankedAreaText"
        ></SvComponent>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { ItemValue, QuestionRankingModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{ question: QuestionRankingModel }>();
const root = ref(null);
useQuestion<QuestionRankingModel>(props, root);
const getItemValueComponentName = (item: ItemValue) => {
  return (
    props.question.getItemValueWrapperComponentName(item) ||
    "survey-ranking-item"
  );
};

const getItemValueComponentData = (
  item: ItemValue,
  index?: number,
  unrankedItem?: boolean
) => {
  return {
    componentName: "survey-ranking-item",
    componentData: {
      question: props.question,
      item,
      index: index,
      unrankedItem: unrankedItem,
      data: props.question.getItemValueWrapperComponentData(item),
    },
  };
};
</script>
