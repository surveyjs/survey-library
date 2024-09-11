<template>
  <div v-if="question.isReadOnlyRenderDiv()" ref="root">
    {{ question.value }}
  </div>
  <div v-else-if="question.dataListId" ref="root">
    <SvComponent :is="'survey-text-input'" :question="question" />
    <datalist :id="question.dataListId">
      <option
        v-for="(item, index) in question.dataList"
        :key="index"
        :value="item"
      ></option>
    </datalist>
  </div>
  <SvComponent
    :is="'survey-text-input'"
    v-else
    :question="question"
    :get-ref="(ref: any) => { root = ref; }"
  />
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionTextModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
const props = defineProps<{ question: QuestionTextModel }>();
const root = ref(null);
defineOptions({
  inheritAttrs: false,
});
useQuestion<QuestionTextModel>(props, root);
</script>
