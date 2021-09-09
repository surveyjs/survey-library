<template>
  <ul
    class="sv-list"
    @mousedown="
      (event) => {
        event.preventDefault();
      }
    "
    v-on:keydown="
      (event) => {
        model.onKeyDown(event);
      }
    "
  >
    <li
      tabindex="0"
      v-show="item.visible === undefined || item.visible"
      class="sv-list__item"
      :style="{ paddingLeft: model.getItemIndent(item) }"
      v-for="item in model.items"
      :key="item.id"
      v-bind:class="model.getItemClass(item)"
      v-on:click="model.selectItem(item)"
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
  </ul>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ListModel } from "survey-core";
import { BaseVue } from "../../base";

@Component
export class List extends BaseVue {
  @Prop() model: ListModel;
  constructor() {
    super();
  }
  getModel() {
    return this.model;
  }
}

Vue.component("sv-list", List);
export default List;
</script>
