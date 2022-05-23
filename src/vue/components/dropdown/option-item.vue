<template>
  <option :value="item.value" :disabled="!item.isEnabled">{{item.text}}</option>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { Base } from "survey-core";
import { BaseVue } from "../../base";

export * from "./dropdown.vue";

@Component
export class DropdownOptionItem extends BaseVue {
  @Prop() item: Base;

  constructor() {
    super();
  }
  getModel() {
    return this.item;
  }
}
Vue.component("sv-dropdown-option-item", DropdownOptionItem);
export default DropdownOptionItem;
</script>
