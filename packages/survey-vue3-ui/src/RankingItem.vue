<template>
  <div
    :tabindex="question.getItemTabIndex(item)"
    :data-sv-drop-target-ranking-item="index"
    :class="question.getItemClass(item)"
    v-on:keydown="
      (event) => {
        question.handleKeydown.call(question, event, item);
      }
    "
    v-on:pointerdown="
      (event) => {
        question.handlePointerDown.call(
          question,
          event,
          item,
          event.currentTarget as HTMLElement
        );
      }
    "
  >
    <div tabindex="-1" style="outline: none">
      <div :class="cssClasses.itemGhostNode"></div>
      <div :class="cssClasses.itemContent">
        <div :class="cssClasses.itemIconContainer">
          <svg :class="question.getIconHoverCss()">
            <use :xlink:href="question.dragDropSvgIcon"></use>
          </svg>
          <svg :class="question.getIconFocusCss()">
            <use :xlink:href="question.arrowsSvgIcon"></use>
          </svg>
        </div>

          <div v-if = "!unrankedItem && indexText" :class="question.getItemIndexClasses(item)">{{ indexText }}</div>
          <div v-else :class="question.getItemIndexClasses(item)">
            <svg>
                <use :xlink:href="question.dashSvgIcon"></use>
            </svg>
        </div>
        <div :class="cssClasses.controlLabel">
          <survey-string :locString="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  ItemValue,
  LocalizableString,
  QuestionRankingModel,
} from "survey-core";
import { useBase } from "./base";

const props = defineProps<{
  index: number;
  indexText: string;
  text: LocalizableString;
  handleKeydown?: Function;
  cssClasses: any;
  question: QuestionRankingModel;
  item: ItemValue;
  unrankedItem?: boolean;
}>();

useBase(() => props.item);
</script>
