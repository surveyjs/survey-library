<template>
  <div :class="page.cssRoot" ref="root">
    <survey-element-title :element="page" :css="css" />
    <div v-if="showDescription" :class="page.cssClasses.page.description">
      <survey-string :locString="page.locDescription" />
    </div>
    <survey-errors :element="page" />
    <template v-for="row in page.rows" :key="row.id">
      <component
        :is="(page.getSurvey() as SurveyModel).getRowWrapperComponentName(row)"
        v-bind="{
            componentData: (page.getSurvey() as SurveyModel).getRowWrapperComponentData(row),
          }"
      >
        <survey-row v-if="row.visible" :row="row" :survey="survey" :css="css">
        </survey-row>
      </component>
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

const onAfterRender = () => {
  if (props.survey && root.value) {
    props.survey.afterRenderPage(root.value);
  }
};

useBase(
  () => props.page,
  () => {
    onAfterRender();
  }
);

const showDescription = computed(() => {
  return props.page._showDescription;
});
onMounted(() => {
  onAfterRender();
});
</script>
