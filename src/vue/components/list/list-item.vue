<template>
  <li
    tabindex="0"
    v-show="model.isItemVisible(item)"
    :style="{ paddingLeft: model.getItemIndent(item) }"
    :key="item.id"
    v-bind:class="model.getItemClass(item)"
    v-on:click="model.selectItem(item)"
    v-on:keyup="keyUp"
  >
    <sv-svg-icon
      v-if="item.iconName && !item.component"
      class="sv-list__item-icon"
      :iconName="item.iconName"
      :size="24"
    ></sv-svg-icon>
    <span v-if="!item.component">{{ item.title }}</span>

    <component v-if="item.component" :is="item.component" :item="item"> </component>
  </li>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Base, ListModel } from "survey-core";
import { BaseVue } from "../../base";
import { attachKey2click } from "../../survey.vue";

export * from "./list.vue";

@Component
export class ListItem extends BaseVue {
  @Prop() item: Base;
  @Prop() model: ListModel;
  constructor() {
    super();
  }
  getModel() {
    return this.item;
  }
  public keyUp(event: any) {
    attachKey2click(event);
  }
}

Vue.component("sv-list-item", ListItem);
export default ListItem;
</script>
