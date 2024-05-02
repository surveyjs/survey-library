<template>
  <div :tabindex="question.getItemTabIndex(item)" :data-sv-drop-target-ranking-item="index" :class="question.getItemClass(item)" v-on:keydown="(event)=>{question.handleKeydown.call(question, event, item)}" v-on:pointerdown="(event)=>{question.handlePointerDown.call(question, event, item, event.currentTarget)}" v-on:pointerup="(event)=>{question.handlePointerUp.call(question, event, item, event.currentTarget)}">
    <div tabindex="-1" style="outline: none;">
      <div :class="cssClasses.itemGhostNode" />
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

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ItemValue, QuestionRankingModel } from "survey-core";

@Component
export class RankingItem extends Vue {
  @Prop() index: number;
  @Prop() indexText: string;
  @Prop() text: string;
  @Prop() handleKeydown: ()=>{};
  @Prop() cssClasses: any
  @Prop() question: QuestionRankingModel
  @Prop() item: ItemValue
  @Prop() unrankedItem: boolean
}
Vue.component("survey-ranking-item", RankingItem);
export default RankingItem;
</script>