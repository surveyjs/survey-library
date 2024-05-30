<template>
  <li role="option" :id="elementId" :aria-selected="model.isItemSelected(item) ? 'true' : 'false'"
    v-show="model.isItemVisible(item)" :key="item.id" v-bind:class="model.getItemClass(item)" v-on:click="click"
    v-bind:tabindex="item.disableTabStop ? -1 : 0"
    v-key2click="{ processEsc: false, disableTabStop: item.disableTabStop }">
    <div v-if="item.needSeparator" v-bind:class="model.cssClasses.itemSeparator" />

    <div :style="{ paddingInlineStart: model.getItemIndent(item) }" v-bind:class="model.cssClasses.itemBody"
      :title="item.locTitle.calculatedText"
      @mouseover="(e) => model.onItemHover(item)"
      @mouseleave="(e) => model.onItemLeave(item)">
      <sv-svg-icon v-if="item.iconName && isDefaultItem" v-bind:class="model.cssClasses.itemIcon"
        :iconName="item.iconName" :size="item.iconSize"></sv-svg-icon>
      <survey-string v-if="isDefaultItem" :locString="item.locTitle" />
      <sv-svg-icon v-if="item.markerIconName" v-bind:class="item.cssClasses.itemMarkerIcon"
        :iconName="item.markerIconName" :size="item.markerIconSize"></sv-svg-icon>
      <sv-popup v-if="item.popupModel && isDefaultItem" :model="item.popupModel"></sv-popup>
      <component v-if="item.component" :is="item.component" :item="item"> </component>
    </div>
  </li>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Base, ListModel, Action, IAction } from "survey-core";
import { BaseVue } from "../../base";
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
  get elementId() {
    return (this.item as IAction)?.elementId;
  }
  get isDefaultItem(): boolean {
    return !this.item.component || this.item.component === "sv-list-item-group";
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
