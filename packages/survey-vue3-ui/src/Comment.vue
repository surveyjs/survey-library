<template>
  <div
    ref="root"
    v-if="!question.isReadOnlyRenderDiv() && question.getMaxLength()"
  >
    <SvComponent
      :is="'sv-text-area'"
      :model="question.textAreaModel"
    ></SvComponent>
    <SvComponent
      :is="'sv-character-counter'"
      :counter="question.characterCounter"
      :remainingCharacterCounter="question.cssClasses.remainingCharacterCounter"
    ></SvComponent>
  </div>
  <SvComponent
    :is="'sv-text-area'"
    ref="root"
    v-else-if="!question.isReadOnlyRenderDiv() && !question.getMaxLength()"
    :model="question.textAreaModel"
  ></SvComponent>
  <div ref="root" v-else>{{ question.value }}</div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionCommentModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionCommentModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
