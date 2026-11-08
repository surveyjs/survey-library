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
import { onBeforeUnmount, onMounted, onUpdated, ref } from "vue";
const props = defineProps<{ survey: SurveyModel; disposed?: boolean; className: string }>();
const root = ref<HTMLElement>();
// The survey whose rootElement this page set, and the element it set: given back on unmount.
let rootSurvey: SurveyModel | undefined;
let rootElement: HTMLElement | undefined;
const clearRootElement = () => {
  if (!!rootSurvey && !rootSurvey.isDisposed && rootSurvey.rootElement === rootElement) {
    rootSurvey.rootElement = undefined as any;
  }
  rootSurvey = undefined;
  rootElement = undefined;
};
// The Survey component would set this; a page rendered on its own leaves it to its host. It is
// cleared on unmount, unless something else set it in the meantime.
const updateRootElement = () => {
  if (!props.disposed && !!root.value) {
    const survey = props.survey;
    if (rootSurvey !== survey) {
      clearRootElement();
    }
    survey.rootElement = root.value;
    rootSurvey = survey;
    rootElement = root.value;
  }
};
onMounted(updateRootElement);
onUpdated(updateRootElement);
onBeforeUnmount(clearRootElement);
</script>
