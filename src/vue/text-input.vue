  <template>
    <input v-if="!question.getMaxLength()"
    :disabled="question.isInputReadOnly"
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
    @change="question.onChange"
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
    <div v-else>
      <input
        :disabled="question.isInputReadOnly"
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
        @change="question.onChange"
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
      <sv-character-counter :counter="question.characterCounter" :remainingCharacterCounter="question.cssClasses.remainingCharacterCounter"></sv-character-counter>
    </div>
  </template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BaseVue } from "./base";
import { QuestionTextModel } from "survey-core";

  @Component
export class QuestionTextInput extends BaseVue {
    @Prop() question: QuestionTextModel;
    get inputStyle(): any {
      return this.question.inputStyle;
    }
    protected getModel() {
      return this.question;
    }
}
Vue.component("survey-text-input", QuestionTextInput);
export default QuestionTextInput;
</script>
