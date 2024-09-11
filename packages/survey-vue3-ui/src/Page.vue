<template>
  <div :class="page.cssRoot" ref="root">
    <SvComponent :is="'survey-element-title'" :element="page" :css="css" />
    <div v-if="showDescription" :class="page.cssClasses.page.description">
      <SvComponent :is="'survey-string'" :locString="page.locDescription" />
    </div>
    <SvComponent :is="'survey-errors'" :element="page" />
    <template v-for="row in page.visibleRows" :key="row.id">
      <SvComponent
        :is="(page.getSurvey() as SurveyModel).getRowWrapperComponentName(row)"
        v-bind="{
            componentData: (page.getSurvey() as SurveyModel).getRowWrapperComponentData(row),
          }"
      >
        <SvComponent :is="'survey-row'" :row="row" :survey="survey" :css="css">
        </SvComponent>
      </SvComponent>
    </template>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { SurveyModel } from "survey-core";
import type { PageModel } from "survey-core";
import { computed, onMounted, ref } from "vue";
import { useBase } from "./base";

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

const showDescription = computed(() => {
  return props.page._showDescription;
});

useBase(
  () => props.page,
  () => {
    onAfterRender();
  }
);

onMounted(() => {
  onAfterRender();
});
</script>
