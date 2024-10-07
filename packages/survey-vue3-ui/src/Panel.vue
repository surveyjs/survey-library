<template>
  <div
    v-if="element.getIsContentVisible()"
    :class="element.getContainerCss()"
    :id="element.id"
    @focusin="element.focusIn()"
    ref="root"
  >
    <SvComponent
      :is="'survey-errors'"
      :element="element"
      v-if="element.showErrorsAbovePanel"
    />
    <SvComponent
      :is="'survey-element-header'"
      v-if="element.hasTitle || element.hasDescription"
      :element="element"
      :css="css"
    ></SvComponent>
    <SvComponent
      :is="'survey-errors'"
      :element="element"
      v-if="!element.showErrorsAbovePanel"
    />
    <div
      :id="element.contentId"
      :style="{ paddingLeft: element.innerPaddingLeft }"
      v-if="element.renderedIsExpanded"
      :class="element.cssClasses.panel.content"
    >
      <template v-for="row in element.visibleRows" :key="row.id">
        <SvComponent
          :is="(element.getSurvey() as SurveyModel).getRowWrapperComponentName(row)"
          v-bind="{
            componentData: (element.getSurvey() as SurveyModel).getRowWrapperComponentData(row),
          }"
        >
          <SvComponent
            :is="'survey-row'"
            :row="row"
            :survey="survey"
            :css="css"
          >
          </SvComponent>
        </SvComponent>
      </template>
      <SvComponent
        :is="'sv-action-bar'"
        :model="element.getFooterToolbar()"
      ></SvComponent>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
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
    props.element.afterRender(root.value);
  }
});
</script>
