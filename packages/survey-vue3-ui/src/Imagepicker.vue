<template>
  <div
    v-if="question.isViewMode && question.getViewModeItems().length === 0"
    :id="question.inputId"
    :class="question.viewModeCssClass"
    ref="root"
  >{{ question.viewDisplayText }}</div>
  <div
    v-else-if="question.isViewMode"
    :id="question.inputId"
    :class="question.getSelectBaseRootCss()"
    ref="root"
  >
    <template v-for="item in question.getViewModeItems()" :key="item.uniqueId">
      <video
        v-if="question.contentMode === 'video'"
        :class="question.cssClasses.image"
        :src="item.locImageLink.renderedHtml"
        :width="question.renderedImageWidth"
        :height="question.renderedImageHeight"
        :style="{ objectFit: question.imageFit }"
        @loadedmetadata="(event) => question.onContentLoaded(item, event)"
      ></video>
      <img
        v-else
        :class="question.cssClasses.image"
        :src="item.locImageLink.renderedHtml"
        :alt="item.locText.renderedHtml"
        :width="question.renderedImageWidth"
        :height="question.renderedImageHeight"
        :style="{ objectFit: question.imageFit }"
        @load="(event) => question.onContentLoaded(item, event)"
      />
    </template>
  </div>
  <fieldset
    v-else
    :class="question.getSelectBaseRootCss()"
    :style="question.getContainerStyle()"
    ref="root"
    @keydown="question.onKeyDown?.($event)"
  >
    <legend class="sv-hidden">{{ question.locTitle.renderedHtml }}</legend>
    <template v-if="!question.hasColumns">
      <SvComponent
        v-for="item in question.visibleChoices"
        :key="item.uniqueId"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item)"
      ></SvComponent>
    </template>
    <template v-if="question.hasColumns">
      <div
        v-for="(column, colIndex) in question.columns"
        :class="question.getColumnClass()"
        :key="colIndex"
        role="presentation"
      >
        <SvComponent
          v-for="item in column"
          :key="item.value"
          :is="getItemValueComponentName(item)"
          v-bind="getItemValueComponentData(item)"
        ></SvComponent>
      </div>
    </template>
  </fieldset>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { ItemValue, QuestionImagePickerModel } from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionImagePickerModel }>();
const root = ref(null);
useQuestion(props, root);
const defaultComponentName = "survey-imagepicker-item";
const getItemValueComponentName = (item: ItemValue) => {
  return (
    props.question.getItemValueWrapperComponentName(item) ||
    defaultComponentName
  );
};

const getItemValueComponentData = (item: ItemValue) => {
  const itemComponent = defaultComponentName;
  return {
    componentName: itemComponent,
    componentData: {
      question: props.question,
      item,
      data: props.question.getItemValueWrapperComponentData(item),
    },
  };
};
</script>
