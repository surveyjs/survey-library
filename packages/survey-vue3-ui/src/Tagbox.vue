<template>
  <div :class="question.renderCssRoot" ref="root">
    <SvComponent :name="'sv-tagbox'" :question="question"></SvComponent>
    <SvComponent
      :name="'survey-other-choice'"
      v-if="question.isOtherSelected"
      :question="question"
    />
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionTagboxModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  question: QuestionTagboxModel;
}>();
const root = ref(null);
useQuestion<QuestionTagboxModel>(props, root);
</script>
