<template>
  <option :value="item.value" :disabled="!item.isEnabled">
    {{ text }}
  </option>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { ItemValue } from "survey-core";
import { BaseVue, useLocString } from "../../base";
export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  props: {
    item: { type: Object as PropType<ItemValue>, required: true },
  },
  setup(props) {
    return {
      text: useLocString(() => props.item.locText),
    };
  },
  methods: {
    getModel() {
      return this.item;
    },
  },
});
</script>
