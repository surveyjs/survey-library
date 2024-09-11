<template>
  <div ref="root" v-if="!question.isReadOnlyRenderDiv() && question.getMaxLength()">
    <sv-text-area :model="question.textAreaModel"></sv-text-area>
    <sv-character-counter
      :counter="question.characterCounter"
      :remainingCharacterCounter="question.cssClasses.remainingCharacterCounter"
    ></sv-character-counter>
  </div>
  <sv-text-area
    ref="root"
    v-else-if="!question.isReadOnlyRenderDiv() && !question.getMaxLength()"
    :model="question.textAreaModel"
  ></sv-text-area>
  <div ref="root" v-else>{{ question.value }}</div>
</template>

<script lang="ts" setup>
import type { QuestionCommentModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionCommentModel }>();
const root = ref(null);
useQuestion(props, root);
</script>
