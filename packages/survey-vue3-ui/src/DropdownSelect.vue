<template>
  <div :class="question.renderCssRoot" ref="root">
    <div :class="question.cssClasses.selectWrapper">
      <select
        v-if="!question.isReadOnly"
        :id="question.inputId"
        v-model="renderedValue"
        @click="click"
        @keyup="keyUp"
        :autocomplete="question.autocomplete"
        :class="question.getControlClass()"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-errormessage="question.ariaErrormessage"
        :required="question.isRequired"
      >
        <option v-if="question.allowClear" value="">
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
          size="auto"
        >
        </sv-svg-icon>
      </div>
    </div>
    <survey-other-choice v-if="question.isOtherSelected" :question="question" />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useQuestion } from "./base";
import type { QuestionDropdownModel } from "survey-core";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionDropdownModel }>();
const root = ref(null);
useQuestion(props, root);
const click = (event: any) => {
  props.question.onClick(event);
};
const keyUp = (event: any) => {
  props.question.onKeyUp(event);
};
const renderedValue = computed({
  get() {
    return props.question.value ?? "";
  },
  set(val) {
    const question = props.question;
    if (val === "") {
      question.renderedValue = undefined;
    } else {
      question.renderedValue = val;
    }
  },
});
</script>

<script lang="ts">
import { RendererFactory } from "survey-core";
RendererFactory.Instance.registerRenderer(
  "dropdown",
  "select",
  "sv-dropdown-select"
);
</script>
