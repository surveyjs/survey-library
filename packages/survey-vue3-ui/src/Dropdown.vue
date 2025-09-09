<template>
  <div :class="question.renderCssRoot" ref="root">
    <SvComponent :is="'sv-dropdown'" :question="question"></SvComponent>
    <SvComponent
      :is="'survey-other-choice'"
      v-if="isShowingChoiceComment"
      :question="question"
      :item="selectedItem"
    />
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionDropdownModel } from "survey-core";
import { useQuestion } from "./base";
import { computed, ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionDropdownModel }>();
const root = ref(null);
useQuestion(props, root);
const selectedItem = computed(() => props.question.selectedItem );
const isShowingChoiceComment = computed(() => props.question.isShowingChoiceComment);
</script>
