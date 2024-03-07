<template>
  <div
    v-if="element.isVisible"
    :class="element.getContainerCss()"
    :id="element.id"
    @focusin="element.focusIn()"
    ref="root"
  >
    <survey-errors :element="element" v-if="element.showErrorsAbovePanel" />
    <survey-element-header
      v-if="element.hasTitle || element.hasDescription"
      :element="element"
      :css="css"
    ></survey-element-header>
    <survey-errors :element="element" v-if="!element.showErrorsAbovePanel" />
    <div
      :id="element.contentId"
      :style="{ paddingLeft: element.innerPaddingLeft }"
      v-if="element.renderedIsExpanded"
      :class="element.cssClasses.panel.content"
    >
      <template v-for="row in element.rows" :key="row.id">
        <component
          :is="(element.getSurvey() as SurveyModel).getRowWrapperComponentName(row)"
          v-bind="{
            componentData: (element.getSurvey() as SurveyModel).getRowWrapperComponentData(row),
          }"
        >
          <survey-row v-if="row.visible" :row="row" :survey="survey" :css="css">
          </survey-row>
        </component>
      </template>
      <sv-action-bar :model="element.getFooterToolbar()"></sv-action-bar>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import type { PanelModel, SurveyModel } from "survey-core";
import { ref, computed, onMounted } from "vue";
import { useBase } from "./base";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  element: PanelModel;
  isEditMode?: boolean;
  css?: any;
}>();
const root = ref<HTMLElement>(null as any);
const survey = computed(() => props.element.survey);

useBase(() => props.element);

onMounted(() => {
  if (props.element.survey) {
    props.element.survey.afterRenderPanel(props.element, root.value);
  }
});
</script>
