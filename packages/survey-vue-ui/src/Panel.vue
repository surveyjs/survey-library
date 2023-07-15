<template>
  <div
    v-if="question.isVisible"
    :class="question.getContainerCss()"
    :id="question.id"
    ref="root"
  >
    <survey-element-header
      v-if="question.hasTitle || question.hasDescription"
      :element="question"
      :css="css"
    ></survey-element-header>
    <survey-errors :element="question" />
    <div
      :id="question.contentId"
      :style="{ paddingLeft: question.innerPaddingLeft }"
      v-if="!isCollapsed"
      :class="question.cssClasses.panel.content"
    >
      <template v-for="(row, index) in rows">
        <survey-row
          v-if="row.visible"
          :key="question.id + '_' + index"
          :row="row"
          :survey="survey"
          :css="css"
        >
        </survey-row>
      </template>
      <sv-action-bar :model="question.getFooterToolbar()"></sv-action-bar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PanelModel } from "survey-core";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useBase } from "./base";

const props = defineProps<{
  question: PanelModel;
  isEditMode?: boolean;
  css?: any;
}>();
const isCollapsedValue = ref(false);
const root = ref<HTMLElement>(null as any);
const rows = computed(() => props.question.rows);
const survey = computed(() => props.question.survey);
const isCollapsed = computed(() => isCollapsedValue.value);

useBase(() => props.question);

onMounted(() => {
  if (props.question.survey) {
    props.question.survey.afterRenderPanel(props.question, root.value);
  }
  isCollapsedValue.value = props.question.isCollapsed;
  const question = props.question;
  question.stateChangedCallback = () => {
    isCollapsedValue.value = props.question.isCollapsed;
  };
});
onUnmounted(() => {
  const question = props.question;
  question.stateChangedCallback = null as any;
});
</script>
