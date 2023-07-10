<template>
  <span v-if="column.isRenderedRequired" :class="question.cssClasses.cellRequiredText">{{ column.requiredText }}</span>
</template>

<script lang="ts">
import { Question, MatrixDropdownColumn } from "survey-core";
import { BaseVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [BaseVue],
  name: "survey-matrixheaderrequired",
  props: {
    question: Object as PropType<Question>,
    column: Object as PropType<MatrixDropdownColumn>,
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
