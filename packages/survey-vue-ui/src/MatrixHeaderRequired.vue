<template>
  <span v-if="column.isRenderedRequired" :class="question.cssClasses.cellRequiredText">{{ column.requiredText }}</span>
</template>

<script lang="ts">
import { Question, MatrixDropdownColumn } from "survey-core";
import { BaseVue } from "./base";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  name: "survey-matrixheaderrequired",
  props: {
    question: Question,
    column: MatrixDropdownColumn,
  },
  data: (vm: any) => {
    return {
      getModel(): any {
        return vm.column;
      }
    };
  },
});
</script>
