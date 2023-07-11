<template>
    <option :value="item.value" :disabled="!item.isEnabled">{{ item.text }}</option>
  </template>  
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { ItemValue } from "survey-core";
import { BaseVue } from "../../base";
export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  props: {
    item: { type: Object as PropType<ItemValue>, required: true },
  },
  methods: {
    getModel() {
      return this.item;
    },
  },
  watch: {
    item(newValue: ItemValue) {
      newValue.locText.onChanged = () => {
        this.$forceUpdate();
      };
      newValue.locText.onChanged();
    },
  },
});
</script>