<template>
  <span :class="question.cssClasses.iconDrag"></span>
</template>

<script lang="ts">
import { BaseVue } from "../../../base";
import { Action, Base } from "survey-core";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  name: "sv-matrix-drag-drop-icon",
  props: {
    item: Object as PropType<Action>,
  },
  methods: {
    getModel(): Base {
      return this.item;
    },
  },
  computed: {
    // readonly
    question(): any {
      return this.item.data.question;
    },
  },
});
</script>
