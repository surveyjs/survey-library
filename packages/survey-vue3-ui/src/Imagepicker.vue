<template>
  <fieldset :class="question.getSelectBaseRootCss()" ref="root">
    <legend class="sv-hidden">{{ question.locTitle.renderedHtml }}</legend>
    <template v-if="!question.hasColumns">
      <component
        v-for="item in question.visibleChoices"
        :key="item.value"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item)"
      ></component>
    </template>
    <template v-if="question.hasColumns">
      <div
        v-for="(column, colIndex) in question.columns"
        :class="question.getColumnClass()"
        :key="colIndex"
        role="presentation"
      >
        <component
          v-for="item in column"
          :key="item.value"
          :is="getItemValueComponentName(item)"
          v-bind="getItemValueComponentData(item)"
        ></component>
      </div>
    </template>
  </fieldset>
</template>

<script lang="ts" setup>
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
