<template>
  <fieldset
    :class="question.getSelectBaseRootCss()"
    ref="root"
    :role="question.a11y_input_ariaRole"
    :aria-required="question.a11y_input_ariaRequired"
    :aria-label="question.a11y_input_ariaLabel"
    :aria-labelledby="question.a11y_input_ariaLabelledBy"
    :aria-describedby="question.a11y_input_ariaDescribedBy"
    :aria-invalid="question.a11y_input_ariaInvalid"
    :aria-errormessage="question.a11y_input_ariaErrormessage"
  >
    <legend v-if="showLegend" class="sv-hidden">
      {{ question.locTitle.renderedHtml }}
    </legend>
    <template v-if="question.hasHeadItems">
      <component
        v-for="item in question.headItems"
        :key="item.value"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item)"
      ></component>
    </template>
    <template v-if="!question.hasColumns && !question.blockedRow">
      <component
        v-for="item in question.bodyItems"
        :key="item.value"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item)"
      ></component>
    </template>
    <div :class="question.cssClasses.rootRow" v-if="question.blockedRow">
      <template v-if="!question.hasColumns && question.blockedRow">
        <component
          v-for="item in question.dataChoices"
          :key="item.value"
          :is="getItemValueComponentName(item)"
          v-bind="getItemValueComponentData(item)"
        ></component>
      </template>
    </div>
    <div
      v-if="question.hasColumns"
      :class="question.cssClasses.rootMultiColumn"
    >
      <template v-if="question.hasColumns">
        <div
          v-for="(column, index) in question.columns"
          :key="index"
          :class="question.getColumnClass()"
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
    </div>
    <template v-if="question.hasFootItems">
      <component
        v-for="item in question.footItems"
        :key="item.value"
        :is="getItemValueComponentName(item)"
        v-bind="getItemValueComponentData(item)"
      ></component>
    </template>
    <survey-other-choice
      v-if="question.renderedValue && question.isOtherSelected"
      :question="question"
    />
    <div v-if="question.showClearButtonInContent">
      <input
        type="button"
        :class="question.cssClasses.clearButton"
        v-on:click="
          () => {
            question.clearValue();
          }
        "
        :value="question.clearButtonCaption"
      />
    </div>
  </fieldset>
</template>

<script lang="ts" setup>
import type {
  ItemValue,
  QuestionCheckboxModel,
  QuestionRadiogroupModel,
} from "survey-core";
import { useQuestion } from "./base";
import { ref } from "vue";
defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  question: QuestionRadiogroupModel | QuestionCheckboxModel;
  showLegend?: boolean;
}>();
const root = ref(null);
useQuestion(props, root);

const getItemValueComponentName = (item: ItemValue) => {
  return (
    props.question.getItemValueWrapperComponentName(item) ||
    props.question.itemComponent
  );
};

const getItemValueComponentData = (item: ItemValue) => {
  return {
    componentName: props.question.itemComponent,
    componentData: {
      question: props.question,
      item,
      data: props.question.getItemValueWrapperComponentData(item),
    },
  };
};
</script>
