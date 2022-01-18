<template>
  <div class="sv-list__container">
    <div class="sv-list__filter" v-if="model.needFilter">
      <input
        type="text"
        class="sv-list__input"
        :placeholder="model.filteredTextPlaceholder"
        :value="model.filteredText"
        @change="change"
        @keyup="keyup"
      />
    </div>
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
      <sv-list-item
        v-for="item in model.renderedActions"
        :item="item"
        :model="model"
        :key="item.id"
      >
      </sv-list-item>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ListModel } from "survey-core";
import { BaseVue } from "../../base";

export * from "./list-item.vue";

@Component
export class List extends BaseVue {
  @Prop() model: ListModel;
  constructor() {
    super();
  }
  getModel() {
    return this.model;
  }
  change(event: any) {
    this.model.filteredText = event.target.value;
  }
  keyup(event: any) {
    this.model.filteredText = event.target.value;
  }
}

Vue.component("sv-list", List);
export default List;
</script>
