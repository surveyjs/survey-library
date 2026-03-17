<template>
  <div :class="question.getRootClass()" @click="onContainerClick" ref="root">
    <div v-if="question.isReadOnlyRenderDiv()">
      {{ question.value }}
    </div>
    <template v-else>
      <SvComponent :is="'survey-text-input'" :question="question" :get-ref="(ref: any) => { inputRef = ref; }" />
      <datalist v-if="question.dataListId" :id="question.dataListId">
        <option v-for="(item, index) in question.dataList" :key="index" :value="item"></option>
      </datalist>
      <div v-if="!!question.getMaxLength()">
        <div :class="question.cssClasses.group">
          <SvComponent :is="'sv-character-counter'" :counter="question.characterCounter"
            :remainingCharacterCounter="question.cssClasses.characterCounter"></SvComponent>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionTextModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
const props = defineProps<{ question: QuestionTextModel }>();
const root = ref<HTMLElement>(null as any);
const inputRef = ref<HTMLInputElement>();
defineOptions({
  inheritAttrs: false,
});
useQuestion<QuestionTextModel>(props, root);
const onContainerClick = () => {
  inputRef.value?.focus();
} 
</script>
