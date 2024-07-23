<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :tabindex="model.noTabIndex ? undefined : 0"
      v-bind:disabled="question.isDisabledAttr ? true : null"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="question.ariaRole"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-errormessage="question.ariaErrormessage"
      :aria-expanded="
        question.ariaExpanded === null
          ? undefined
          : question.ariaExpanded === 'true'
      "
      :aria-controls="model.listElementId"
      :aria-activedescendant="model.ariaActivedescendant"
      :required="question.isRequired ? true : null"
    >
      <div :class="question.cssClasses.controlValue">
        <SurveyVueComponent
          :name="'sv-tagbox-item'"
          v-for="(item, index) in selectedChoices"
          :item="item"
          :question="question"
          :key="'item' + index"
        ></SurveyVueComponent>
        <SurveyVueComponent
          :name="'sv-tagbox-filter'"
          :model="model"
          :question="question"
        ></SurveyVueComponent>
      </div>
      <div
        :class="question.cssClasses.cleanButton"
        v-if="question.allowClear && question.cssClasses.cleanButtonIconId"
        v-show="question.showClearButton"
        @click="clear"
        aria-hidden="true"
      >
        <SurveyVueComponent
          :name="'sv-svg-icon'"
          :class="question.cssClasses.cleanButtonSvg"
          :iconName="question.cssClasses.cleanButtonIconId"
          :title="question.clearCaption"
          size="auto"
        >
        </SurveyVueComponent>
      </div>
    </div>
    <SurveyVueComponent
      :name="'sv-popup'"
      v-if="!question.isReadOnly"
      :model="model.popupModel"
    ></SurveyVueComponent>
    <div
      v-else
      :id="question.inputId"
      :aria-label="question.a11y_input_ariaLabel"
      :aria-labelledby="question.a11y_input_ariaLabelledBy"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
      :tabindex="question.isDisabledAttr ? undefined : 0"
      :class="question.getControlClass()"
    >
      <SurveyVueComponent
        :name="'survey-string'"
        v-if="question.locReadOnlyText"
        :locString="question.locReadOnlyText"
      />
    </div>
    <div
      :class="question.cssClasses.chevronButton"
      v-on:pointerdown="chevronPointerDown"
      v-if="question.cssClasses.chevronButtonIconId"
      aria-hidden="true"
    >
      <SurveyVueComponent
        :name="'sv-svg-icon'"
        :class="question.cssClasses.chevronButtonSvg"
        :iconName="question.cssClasses.chevronButtonIconId"
        size="auto"
      >
      </SurveyVueComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SurveyVueComponent from "@/SurveyVueComponent.vue";
import { useBase, useComputedArray } from "@/base";
import { DropdownMultiSelectListModel, QuestionTagboxModel } from "survey-core";
import { computed } from "vue";

const props = defineProps<{ question: QuestionTagboxModel }>();
const model = computed(() => {
  const question = props.question;
  if (!question.dropdownListModel) {
    question.dropdownListModel = new DropdownMultiSelectListModel(question);
  }
  return props.question.dropdownListModel;
});
const click = (event: any) => {
  model.value?.onClick(event);
};
const chevronPointerDown = (event: any) => {
  model.value?.chevronPointerDown(event);
};
const clear = (event: any) => {
  model.value?.onClear(event);
};
const keyhandler = (event: any) => {
  model.value?.keyHandler(event);
};
const blur = (event: any) => {
  model.value?.onBlur(event);
};
const selectedChoices = useComputedArray(() => props.question.selectedChoices);

useBase(() => model.value);
</script>
