<template>
  <li
    tabindex="0"
    role="option"
    :aria-selected="model.isItemSelected(item)"
    v-show="model.isItemVisible(item)"
  >
    <div 
      v-if="item.needSeparator"
      v-bind:class="model.cssClasses.itemSeparator"
      />

    <div
      :style="{ paddingLeft: model.getItemIndent(item) }"
      :key="item.id"
      v-bind:class="model.getItemClass(item)"
      v-on:click="click"
      v-on:keyup="keyUp"
    >
      <sv-svg-icon
        v-if="item.iconName && !item.component"
        v-bind:class="model.cssClasses.itemIcon"
        :iconName="item.iconName"
        :size="24"
      ></sv-svg-icon>
      <survey-string v-if="!item.component" :locString="item.locTitle" />
      <component v-if="item.component" :is="item.component" :item="item"> </component>
    </div>
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
  public click(event: any) {
    this.model.onItemClick(this.item as any);
    event.stopPropagation();
  }
}

Vue.component("sv-list-item", ListItem);
export default ListItem;
</script>
