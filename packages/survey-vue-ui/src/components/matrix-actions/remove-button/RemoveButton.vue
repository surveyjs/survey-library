<template>
  <button
    type="button"
    :class="question.getRemoveRowButtonCss()"
    :disabled="question.isInputReadOnly"
    @click="() => question.removeRowUI(row)"
  >
    <survey-string :locString="question.locRemoveRowText" />
    <span :class="question.cssClasses.iconRemove"></span>
  </button>
</template>

<script lang="ts">
import { BaseVue } from "../../../base";
import { Action, Base } from "survey-core";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  name: "sv-matrix-remove-button",
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
    row() {
      return this.item.data.row;
    },
  },
});
</script>
