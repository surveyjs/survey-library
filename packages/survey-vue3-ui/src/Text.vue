<template>
  <div :class="question.getRootClass()" @click="question.onContainerClick($event)" ref="root">
    <div v-if="question.isReadOnlyRenderDiv()">
      {{ question.value }}
    </div>
    <template v-else>
      <input
        :disabled="question.isDisabledAttr"
        :readonly="question.isReadOnlyAttr"
        :class="question.getControlClass()"
        :type="question.inputType"
        :maxlength="question.getMaxLength()"
        :min="question.renderedMin"
        :max="question.renderedMax"
        :step="question.renderedStep"
        :size="question.renderedInputSize"
        :style="inputStyle"
        :id="question.inputId"
        :list="question.dataListId"
        :placeholder="question.renderedPlaceholder"
        :autocomplete="question.autocomplete"
        :value="question.inputValue"
        @input="onInput"
        @change="question.onChange"
        @click="question.readOnlyBlocker"
        @pointerdown="question.readOnlyBlocker"
        @keyup="question.onKeyUp"
        @keydown="question.onKeyDown"
        @composition-update="question.onCompositionUpdate"
        @blur="question.onBlur"
        @focus="question.onFocus"
        :aria-required="question.a11y_input_ariaRequired"
        :aria-label="question.a11y_input_ariaLabel"
        :aria-labelledby="question.a11y_input_ariaLabelledBy"
        :aria-describedby="question.a11y_input_ariaDescribedBy"
        :aria-invalid="question.a11y_input_ariaInvalid"
        :aria-errormessage="question.a11y_input_ariaErrormessage"
      />
      <datalist v-if="question.dataListId" :id="question.dataListId">
        <option v-for="(item, index) in question.dataList" :key="index" :value="item"></option>
      </datalist>
      <SvComponent v-if="question.hasVisibleInputActions" :is="'sv-action-bar'" :model="question.inputActionsContainer"></SvComponent>
    </template>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import type { QuestionTextModel } from "survey-core";
import { useQuestion } from "./base";
import { computed, ref } from "vue";
const props = defineProps<{ question: QuestionTextModel }>();
const root = ref<HTMLElement>(null as any);
defineOptions({
  inheritAttrs: false,
});
useQuestion<QuestionTextModel>(props, root);
const inputStyle = computed(() => props.question.inputStyle);
// React's onChange is the input event. onTyping has to follow it, or a value
// committed on blur re-renders the dialog and the Apply click never reaches the button.
function onInput(event: Event): void {
  if (props.question.isInputTextUpdate) props.question.onChange(event);
}
</script>
