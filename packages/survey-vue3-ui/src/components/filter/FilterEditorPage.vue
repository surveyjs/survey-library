<template>
  <div v-if="!disposed" :class="className" ref="root">
    <SvComponent :is="'sv-page'" :survey="survey" :page="survey.currentPage" :css="survey.css"></SvComponent>
  </div>
</template>
<script lang="ts" setup>
// The page of an editor survey of the Filter Control: the Filters dialog's fields, a "condition"
// popup's, and a preset dialog's form and survey. It is drawn as a page, not as a whole Survey (a
// Survey inside another survey's question would put a <form> inside a <form>).
import SvComponent from "@/SvComponent.vue";
import type { SurveyModel } from "survey-core";
import { onMounted, onUpdated, ref } from "vue";
const props = defineProps<{ survey: SurveyModel; disposed?: boolean; className: string }>();
const root = ref<HTMLElement>();
// The Survey component would set this; a page rendered on its own leaves it to its host.
const updateRootElement = () => {
  if (!props.disposed && !!root.value) {
    const survey = props.survey;
    survey.rootElement = root.value;
  }
};
onMounted(updateRootElement);
onUpdated(updateRootElement);
</script>
