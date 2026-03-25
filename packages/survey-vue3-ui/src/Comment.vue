<template>
  <SvComponent
    :is="'sv-text-area'"
    :get-ref="getRef"
    v-if="!question.isReadOnlyRenderDiv()"
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
const root = ref<HTMLElement>();
function getRef(el: HTMLElement) {
  root.value = el;
}
useQuestion(props, root);
</script>
