<template>
  <div
    v-if="element.isVisible"
    :class="element.getContainerCss()"
    :id="element.id"
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
      v-if="!isCollapsed"
      :class="element.cssClasses.panel.content"
    >
      <template v-for="(row, index) in rows">
        <survey-row
          v-if="row.visible"
          :key="element.id + '_' + index"
          :row="row"
          :survey="survey"
          :css="css"
        >
        </survey-row>
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
import type { PanelModel } from "survey-core";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useBase } from "./base";

const props = defineProps<{
  element: PanelModel;
  isEditMode?: boolean;
  css?: any;
}>();
const isCollapsedValue = ref(false);
const root = ref<HTMLElement>(null as any);
const rows = computed(() => props.element.rows);
const survey = computed(() => props.element.survey);
const isCollapsed = computed(() => isCollapsedValue.value);

useBase(() => props.element);

onMounted(() => {
  if (props.element.survey) {
    props.element.survey.afterRenderPanel(props.element, root.value);
  }
  isCollapsedValue.value = props.element.isCollapsed;
  const element = props.element;
  element.stateChangedCallback = () => {
    isCollapsedValue.value = props.element.isCollapsed;
  };
});
onUnmounted(() => {
  const element = props.element;
  element.stateChangedCallback = null as any;
});
</script>
