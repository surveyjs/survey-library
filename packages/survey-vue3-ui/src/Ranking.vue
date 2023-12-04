<template>
  <div :class="question.rootClass" ref="root">
    <template v-if="!question.selectToRankEnabled">
      <component
        v-for="(item, index) in question.rankingChoices"
        :key="item.value + '-' + index + '-item'"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item, index)"
      ></component>
    </template>

    <div
      v-if="question.selectToRankEnabled"
      :class="question.getContainerClasses('from')"
      data-ranking="from-container"
    >
      <component
        v-for="(item, index) in question.unRankingChoices"
        :key="item.value + '-' + index + '-item'"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item, index, true)"
      ></component>

      <div
        v-if="question.unRankingChoices.length === 0"
        :class="question.cssClasses.containerPlaceholder"
      >
        <survey-string :locString="question.locSelectToRankEmptyRankedAreaText"></survey-string>
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
      <component
        v-for="(item, index) in question.rankingChoices"
        :key="item.value + '-' + index + '-item'"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item, index)"
      ></component>

      <div
        v-if="question.rankingChoices.length === 0"
        :class="question.cssClasses.containerPlaceholder"
      >
        <survey-string :locString="question.locSelectToRankEmptyUnrankedAreaText"></survey-string>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  const itemComponentProperty =
    props.question.getPropertyByName("itemComponent");
  const isDefaultItemComponent = itemComponentProperty.isDefaultValue(
    props.question.itemComponent
  );
  const itemComponent = isDefaultItemComponent
    ? "survey-ranking-item"
    : props.question.itemComponent;

  return {
    componentName: itemComponent,
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
