<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :tabindex="model.noTabIndex ? undefined : 0"
      v-bind:disabled="question.isInputReadOnly ? true : null"
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
        <sv-tagbox-item
          v-for="(item, index) in selectedChoices"
          :item="item"
          :question="question"
          :key="'item' + index"
        ></sv-tagbox-item>
        <sv-tagbox-filter
          :model="model"
          :question="question"
        ></sv-tagbox-filter>
      </div>
      <div
        :class="question.cssClasses.cleanButton"
        v-if="question.allowClear && question.cssClasses.cleanButtonIconId"
        v-show="question.showClearButton"
        @click="clear"
        aria-hidden="true"
      >
        <sv-svg-icon
          :class="question.cssClasses.cleanButtonSvg"
          :iconName="question.cssClasses.cleanButtonIconId"
          :title="question.clearCaption"
          size="auto"
        >
        </sv-svg-icon>
      </div>
    </div>
    <sv-popup v-if="!question.isReadOnly" :model="model.popupModel"></sv-popup>
    <div
      disabled
      v-else
      :id="question.inputId"
      :class="question.getControlClass()"
    >
      <survey-string
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
      <sv-svg-icon
        :class="question.cssClasses.chevronButtonSvg"
        :iconName="question.cssClasses.chevronButtonIconId"
        size="auto"
      >
      </sv-svg-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
