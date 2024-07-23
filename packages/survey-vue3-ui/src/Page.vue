<template>
  <div :class="page.cssRoot" ref="root">
    <SurveyVueComponent
      :name="'survey-element-title'"
      :element="page"
      :css="css"
    />
    <div v-if="showDescription" :class="page.cssClasses.page.description">
      <SurveyVueComponent
        :name="'survey-string'"
        :locString="page.locDescription"
      />
    </div>
    <SurveyVueComponent :name="'survey-errors'" :element="page" />
    <template v-for="row in page.visibleRows" :key="row.id">
      <SurveyVueComponent
        :name="(page.getSurvey() as SurveyModel).getRowWrapperComponentName(row)"
        v-bind="{
            componentData: (page.getSurvey() as SurveyModel).getRowWrapperComponentData(row),
          }"
      >
        <SurveyVueComponent
          :name="'survey-row'"
          :row="row"
          :survey="survey"
          :css="css"
        >
        </SurveyVueComponent>
      </SurveyVueComponent>
    </template>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
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
