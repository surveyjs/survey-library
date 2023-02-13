  <template>
    <input v-if="!question.maxLength"
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
    :value="question.value"
    @change="question.onChange"
    @keyup="question.onKeyUp"
    @keydown="question.onKeyDown"
    @composition-update="question.onCompositionUpdate"
    @blur="question.onBlur"
    :aria-required="question.ariaRequired"
    :aria-label="question.ariaLabel"
    :aria-invalid="question.ariaInvalid"
    :aria-describedby="question.ariaDescribedBy"
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
        :value="question.value"
        @change="question.onChange"
        @keyup="question.onKeyUp"
        @keydown="question.onKeyDown"
        @composition-update="question.onCompositionUpdate"
        @blur="question.onBlur"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
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
  