<template>
  <li
    tabindex="0"
    role="option"
    :aria-selected="model.isItemSelected(item)"
    v-show="model.isItemVisible(item)"
    :key="item.id"
    :id="elementId"
    v-bind:class="model.getItemClass(item)"
    v-on:click="click"
    v-key2click
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
      <component v-if="item.component" :is="item.component" :item="item">
      </component>
    </div>
  </li>
</template>

<script lang="ts">
import { BaseVue } from "@/base";
import type { ListModel, Action, IAction } from "survey-core";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-list-item",
  props: {
    model: { type: Object as PropType<ListModel>, required: true },
    item: { type: Object as PropType<Action>, required: true },
  },
  mixins: [BaseVue],
  methods: {
    click(event: any) {
      this.model.onItemClick(this.item as any);
      event.stopPropagation();
    },
    getModel() {
      return this.item;
    },
  },
  computed: {
    elementId() {
      return (this.item as IAction)?.elementId;
    },
  },
  mounted() {
    setTimeout(() => {
      this.model.onLastItemRended(this.item as any);
    });
  },
});
</script>
