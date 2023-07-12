<template>
  <button
    type="button"
    :class="item.getActionBarItemCss()"
    v-on:click="
      () => {
        item.action();
      }
    "
    v-on:keyup="
      (evt) => {
        evt.stopPropagation();
      }
    "
    v-bind:disabled="item.enabled !== undefined && item.enabled"
    v-bind:title="item.tooltip || item.title"
    v-bind:role="item.ariaRole"
    v-bind:tabindex="item.disableTabStop ? -1 : 0"
  >
    <sv-svg-icon
      v-if="item.iconName"
      :class="item.cssClasses.itemIcon"
      :iconName="item.iconName"
      :size="item.iconSize"
      :title="item.tooltip || item.title"
    ></sv-svg-icon>

    <span
      v-if="item.hasTitle"
      :class="item.getActionBarItemTitleCss()"
      >{{ item.title }}</span
    >
    <sv-popup :model="item.popupModel"></sv-popup>
  </button>
</template>

<script lang="ts">
import { Action, ActionDropdownViewModel } from "survey-core";
import { BaseVue } from "../../base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-action-bar-item-dropdown",
  props: {
    item: { type: Object as PropType<Action>, required: true },
  },
  mixins: [BaseVue],
  setup() {
    return { viewModel: undefined as any as ActionDropdownViewModel };
  },
  beforeCreate() {
    this.viewModel = new ActionDropdownViewModel(this.item);
  },
  beforeUnmount() {
    this.viewModel.dispose();
  },
  methods: {
    getModel() {
      return this.item;
    },
  },
});
</script>