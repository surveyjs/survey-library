<template>
  <div class="sv-tagbox__item" :key="item.key">
    <div class="sv-tagbox__item-text">
      <survey-string :locString="item.locText" />
    </div>
    <div
      v-bind:class="question.cssClasses.cleanItemButton"
      v-on:click="removeItem"
    >
      <sv-svg-icon
        v-bind:class="question.cssClasses.cleanItemButtonSvg"
        :iconName="question.cssClasses.cleanItemButtonIconId"
        :size="'auto'"
      ></sv-svg-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import type { ItemValue, QuestionTagboxModel } from "survey-core";

const props = defineProps<{ question: QuestionTagboxModel; item: ItemValue }>();
const removeItem = (event: any) => {
  props.question.dropdownListModel.deselectItem(props.item.value);
  event.stopPropagation();
};

useBase(() => props.item);
</script>
