<template>
  <div class="sv-tagbox__item" :key="item.key">
    <div class="sv-tagbox__item-text">
      <survey-string :locString="item.locText" />
    </div>
    <div v-bind:class="question.cssClasses.cleanItemButton" v-on:click="removeItem">
      <sv-svg-icon
        v-bind:class="question.cssClasses.cleanItemButtonSvg"
        :iconName="question.cssClasses.cleanItemButtonIconId"
        :size="'auto'"
      ></sv-svg-icon>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ItemValue, QuestionTagboxModel } from "survey-core";
import { BaseVue } from "../../base";

@Component
export class TagboxItem extends BaseVue {
  @Prop() item: ItemValue;
  @Prop() question: QuestionTagboxModel;
  constructor() {
    super();
  }
  getModel() {
    return this.item;
  }
  public removeItem(event: any) {
    this.question.dropdownListModel.deselectItem(this.item.value);
    event.stopPropagation();
  }
}

Vue.component("sv-tagbox-item", TagboxItem);
export default TagboxItem;
</script>
