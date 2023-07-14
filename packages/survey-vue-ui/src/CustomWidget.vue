<template>
  <div>
    <div v-if="hasHtml" v-html="customHtml"></div>
    <component
      v-if="hasDefaultRender"
      :is="componentName"
      :question="question"
      :css="css"
    />
  </div>
</template>
<script lang="ts">
import type { Question } from "survey-core";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    question: { type: Object as PropType<Question>, required: true },
    css: Object,
  },
  computed: {
    hasDefaultRender(): boolean {
      return this.question.customWidget.isDefaultRender;
    },
    hasHtml(): boolean {
      return this.question.customWidget.htmlTemplate ? true : false;
    },
    customHtml(): string {
      return this.question.customWidget.htmlTemplate;
    },
    componentName(): string {
      return "survey-" + this.question.getTemplate();
    },
  },
  mounted() {
    this.question.customWidget.afterRender(this.question, this.$el);
  },
  beforeUnmount() {
    this.question.customWidget.willUnmount(this.question, this.$el);
  },
});
</script>
