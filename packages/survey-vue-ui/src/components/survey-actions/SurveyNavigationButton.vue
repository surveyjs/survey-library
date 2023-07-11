<template>
 <input
    v-if="item.visible"
    type="button"
    :disabled="item.disabled"
    :value="item.title"
    :class="item.innerCss"
    :title="item.getTooltip()"
    @mousedown="buttonMouseDown"
    @click="item.action"
  />
</template>

<script lang="ts">
import { type PropType, defineComponent } from "vue";
import { Action } from "survey-core";
import { BaseVue } from "../../base";

export default defineComponent({
  mixins: [BaseVue],
  props: {
    item: { type: Object as PropType<Action>, required: true },
  },
  methods: {
    getModel() {
      return this.item;
    },
    buttonMouseDown() {
      return this.item.data && this.item.data.mouseDown();
    },
  },
});
</script>
