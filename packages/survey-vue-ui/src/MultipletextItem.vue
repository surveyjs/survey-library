<template>
  <label :class="question.getItemLabelCss(item)">
    <span :class="question.getItemTitleCss()">
      <span
        v-if="
          item.editor.isRequireTextBeforeTitle ||
          item.editor.isRequireTextOnStart
        "
        :class="question.cssClasses.requiredText"
        >{{ item.editor.requiredText }}</span
      >
      <survey-string :locString="item.locTitle" />
      <span
        v-if="item.editor.isRequireTextAfterTitle"
        :class="question.cssClasses.requiredText"
        >{{ item.editor.requiredText }}</span
      >
    </span>
    <div :key="item.editor.id" :class="question.getItemCss()">
      <survey-errors
        v-if="item.editor.showErrorOnTop"
        :element="item.editor"
        :location="'top'"
      />
      <component
        :is="getComponentName(item.editor)"
        :question="item.editor"
      />
      <survey-errors
        v-if="item.editor.showErrorOnBottom"
        :element="item.editor"
        :location="'bottom'"
      />
    </div>
    <survey-errors
      v-if="item.editor.isErrorsModeTooltip"
      :element="item.editor"
      :location="'tooltip'"
    />
  </label>
</template>

<script lang="ts">
import { Question, MultipleTextItemModel, QuestionMultipleTextModel } from "survey-core";
import { getComponentName } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  name: "survey-multipletext-item",
  props: {
    question: Object as PropType<QuestionMultipleTextModel>,
    item: { type: Object as PropType<MultipleTextItemModel>, required: true },
  },
  methods: {
    getModel() {
      return this.item.editor;
    },
    getComponentName: (question: Question) => {
      return getComponentName(question);
    },
  },
});
</script>
