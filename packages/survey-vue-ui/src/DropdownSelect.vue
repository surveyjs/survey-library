<template>
  <div :class="question.renderCssRoot">
    <div :class="question.cssClasses.selectWrapper">
      <select
        v-if="!question.isReadOnly"
        :id="question.inputId"
        v-model="question.renderedValue"
        @click="click"
        @keyup="keyUp"
        :autocomplete="question.autocomplete"
        :class="question.getControlClass()"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
        :required="question.isRequired"
      >
        <option v-if="question.allowClear" :value="undefined">
          {{ question.placeholder }}
        </option>
        <sv-dropdown-option-item
          v-for="item in question.visibleChoices"
          :item="item"
          :key="item.id"
        ></sv-dropdown-option-item>
      </select>
      <div
        disabled
        v-else
        :id="question.inputId"
        :class="question.getControlClass()"
      >
        {{ question.readOnlyText }}
      </div>
      <div
        :class="question.cssClasses.chevronButton"
        v-if="question.cssClasses.chevronButtonIconId"
      >
        <sv-svg-icon
          :class="question.cssClasses.chevronButtonSvg"
          :iconName="question.cssClasses.chevronButtonIconId"
          size="24"
        >
        </sv-svg-icon>
      </div>
    </div>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>

<script lang="ts">
import { QuestionDropdownModel, RendererFactory } from "survey-core";
import { QuestionVue } from "./base";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  mixins: [QuestionVue],
  props: {
    question: {
      type: Object as PropType<QuestionDropdownModel>,
      required: true,
    },
  },
  methods: {
    click(event: any) {
      this.question.onClick(event);
    },
    keyUp(event: any) {
      this.question.onKeyUp(event);
    },
  },
});
RendererFactory.Instance.registerRenderer(
  "dropdown",
  "select",
  "sv-dropdown-select"
);
</script>
