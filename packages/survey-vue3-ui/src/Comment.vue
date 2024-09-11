<template>
  <div
    ref="root"
    v-if="!question.isReadOnlyRenderDiv() && question.getMaxLength()"
  >
    <SvComponent
      :name="'sv-text-area'"
      :model="question.textAreaModel"
    ></SvComponent>
    <SvComponent
      :name="'sv-character-counter'"
      :counter="question.characterCounter"
      :remainingCharacterCounter="question.cssClasses.remainingCharacterCounter"
    ></SvComponent>
  </div>
  <sv-text-area
    ref="root"
    v-else-if="!question.isReadOnlyRenderDiv() && !question.getMaxLength()"
    :model="question.textAreaModel"
  ></sv-text-area>
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
