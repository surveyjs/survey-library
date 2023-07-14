<template>
  <div :class="remainingCharacterCounter">
    {{ counter.remainingCharacterCounter }}
  </div>
</template>

<script lang="ts">
import { BaseVue } from "@/base";
import type { CharacterCounter } from "survey-core";
import { type PropType, defineComponent } from "vue";

export default defineComponent({
  mixins: [BaseVue],
  props: {
    counter: { type: Object as PropType<CharacterCounter>, required: true },
    remainingCharacterCounter: String,
  },
  methods: {
    getModel() {
      return this.counter;
    },
  },
});
</script>
