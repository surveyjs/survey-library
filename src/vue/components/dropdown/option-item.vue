<template>
  <option :value="item.value" :disabled="!item.isEnabled">{{ item.text }}</option>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ItemValue } from "survey-core";
import { BaseVue } from "../../base";

export * from "./dropdown.vue";

@Component
export class DropdownOptionItem extends BaseVue {
  @Prop() item: ItemValue;

  constructor() {
    super();

    if (!this.item.locText) return;
    const self = this;
    this.item.locText.onChanged = () => {
      self.$forceUpdate();
    };
    this.item.locText.onChanged();
  }
  getModel() {
    return this.item;
  }
}
Vue.component("sv-dropdown-option-item", DropdownOptionItem);
export default DropdownOptionItem;
</script>
