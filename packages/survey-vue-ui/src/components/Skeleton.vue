<template>
  <div class="sv-skeleton-element" :id="element.id"></div>
</template>

<script lang="ts">
import { BaseVue } from "@/base";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "sv-skeleton",
  props: {
    element: Object,
  },
  mixins: [BaseVue],
  methods: {
    getModel() { return this.element; }
  }
});
</script>
