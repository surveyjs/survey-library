<template>
  <div v-bind:class="item.getActionRootCss()" 
      :id="item.id">
    <div class="sv-action__content">
      <sv-action-bar-separator
        v-if="item.needSeparator"
      ></sv-action-bar-separator>
      <component :is="componentName" :item="item"> </component>
    </div>
  </div>
</template>
<script lang="ts">
import { BaseVue } from "@/base";
import { Action } from "survey-core";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-action",
  mixins: [BaseVue],
  props: {
    item: { type: Object as PropType<Action>, required: true },
  },
  computed: {
    componentName() {
      return this.item.component || "sv-action-bar-item";
    },
  },
  methods: {
    getModel() {
      return this.item;
    },
  },
});

</script>
