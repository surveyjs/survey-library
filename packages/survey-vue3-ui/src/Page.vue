<template>
  <div :class="page.cssRoot" ref="root">
    <survey-element-title :element="page" :css="css" />
    <div v-if="showDescription" :class="page.cssClasses.page.description">
      <survey-string :locString="page.locDescription" />
    </div>
    <survey-errors :element="page" />
    <template v-for="row in rows" :key="row.id">
      <component
        :is="(page.getSurvey() as SurveyModel).getRowWrapperComponentName(row)"
        v-bind="{
            componentData: (page.getSurvey() as SurveyModel).getRowWrapperComponentData(row),
          }"
      >
        <survey-row :row="row" :survey="survey" :css="css"> </survey-row>
      </component>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { AnimationCollection } from "survey-core";
import type { QuestionRowModel, SurveyModel } from "survey-core";
import type { PageModel } from "survey-core";
import { useBase } from "./base";
import {
  computed,
  onMounted,
  ref,
  shallowRef,
  triggerRef,
  getCurrentInstance,
} from "vue";

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

const rows = shallowRef(props.page.visibleRows);
const page = props.page;

let animationCollection: AnimationCollection<QuestionRowModel>;
useBase(
  () => props.page,
  (newValue) => {
    if (animationCollection) {
      animationCollection.dispose();
    }
    animationCollection = new AnimationCollection(
      newValue,
      "visibleRows",
      {
        getElement: (row: QuestionRowModel) =>
          document.getElementById((row as any).id) as HTMLElement,
        onLeave: { classes: { onLeave: "fadeOut", onHide: "hidden" } },
        onEnter: {
          classes: { onEnter: "fadeIn" },
          onBeforeRunAnimation: (el) => {
            el.style.setProperty("--animation-height", el.offsetHeight + "px");
          },
        },
      },
      (updateRows: Array<any>) => {
        rows.value = updateRows;
        triggerRef(rows);
      }
    );
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
