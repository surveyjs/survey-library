<template>
  <li
    tabindex="0"
    role="option"
    id="model.elementId"
    :aria-selected="model.isItemSelected(item)"
    v-show="model.isItemVisible(item)"
    :key="item.id"
    v-bind:class="model.getItemClass(item)"
    v-on:click="click"
    v-on:keyup="keyUp"
  >
    <div 
      v-if="item.needSeparator"
      v-bind:class="model.cssClasses.itemSeparator"
      />

    <div
      :style="{ paddingInlineStart: model.getItemIndent(item) }"
      v-bind:class="model.cssClasses.itemBody"
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
import { Base, ListModel, Action } from "survey-core";
import { BaseVue, attachKey2click } from "../../base";

export * from "./list.vue";

@Component
export class ListItem extends BaseVue {
  @Prop() item: Action;
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
  protected onMounted() {
    this.model.onLastItemRended(<any>this.item);
  }
}

Vue.component("sv-list-item", ListItem);
export default ListItem;
</script>
