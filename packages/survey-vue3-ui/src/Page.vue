<template>
  <div :class="page.cssRoot" ref="root">
    <survey-element-title :element="page" :css="css" />
    <div v-if="showDescription" :class="page.cssClasses.page.description">
      <survey-string :locString="page.locDescription" />
    </div>
    <template v-for="(row, index) in rows">
      <survey-row
        v-if="row.visible"
        :key="page.id + '_' + index"
        :row="row"
        :survey="survey"
        :css="css"
      >
      </survey-row>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { SurveyModel } from "survey-core";
import type { PageModel } from "survey-core";
import { useBase } from "./base";
import { computed, onMounted, onUpdated, ref } from "vue";

const props = defineProps<{
  survey: SurveyModel;
  page: PageModel;
  css?: object;
}>();

const root = ref<HTMLElement>(null as any);

useBase(() => props.page);

const showDescription = computed(() => {
  return props.page._showDescription;
});
const rows = computed((): Array<any> => {
  return props.page.rows;
});

onMounted(() => {
  if (props.survey) {
    props.survey.afterRenderPage(root.value);
  }
});
onUpdated(() => {
  props.survey.afterRenderPage(root.value);
});
</script>
