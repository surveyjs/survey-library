<template>
  <div :class="question.cssClasses.hint">
    <div v-if="model.showHintPrefix" :class="question.cssClasses.hintPrefix">
      <span>{{ model.hintStringPrefix }}</span>
    </div>

    <div :class="question.cssClasses.hintSuffixWrapper">
      <survey-string
        v-if="question.showSelectedItemLocText"
        :locString="question.selectedItemLocText"
      />
      <div v-if="model.showHintString" :class="question.cssClasses.hintSuffix">
        <span style="visibility: hidden">{{ model.inputStringRendered }}</span>
        <span>{{ model.hintStringSuffix }}</span>
      </div>
      <input
        type="text"
        autocomplete="off"
        v-model="model.inputStringRendered"
        :class="question.cssClasses.filterStringInput"
        :placeholder="model.filterStringPlaceholder"
        :disabled="question.isInputReadOnly"
        :inputmode="model.inputMode"
        :role="model.filterStringEnabled ? question.ariaRole : null"
        :aria-label="question.placeholder"
        :aria-expanded="question.ariaExpanded"
        :aria-controls="model.listElementId"
        :aria-activedescendant="model.ariaActivedescendant"
        :id="question.getInputId()"
        :readonly="!model.searchEnabled ? true : null"
        :size="!model.inputStringRendered ? 1 : null"
        @change="inputChange"
        @keydown="inputKeyHandler"
        @blur="blur"
        @focus="focus"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { BaseVue } from "../../base";
import { DropdownMultiSelectListModel, QuestionTagboxModel } from "survey-core";

export default defineComponent({
  props: {
    model: { type: Object as PropType<DropdownMultiSelectListModel>, required: true },
    question: Object as PropType<QuestionTagboxModel>,
  },
  mixins: [BaseVue],
  name: "sv-tagbox-filter",
  methods: {
    getModel() {
      return this.model;
    },
    inputChange(event: any) {
      // eslint-disable-next-line vue/no-mutating-props
      this.model.inputStringRendered = event.target.value;
    },
    inputKeyHandler(event: any) {
      this.model.inputKeyHandler(event);
    },
    blur(event: any) {
      this.model.onBlur(event);
    },
    focus(event: any) {
      this.model.onFocus(event);
    },
  },
});
</script>
