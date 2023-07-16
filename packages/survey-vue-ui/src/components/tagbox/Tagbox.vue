<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :tabindex="model.inputReadOnly ? undefined : 0"
      v-bind:disabled="question.isInputReadOnly ? true : null"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="question.ariaRole"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
      :aria-expanded="question.ariaExpanded"
      :aria-controls="model.listElementId"
      :aria-activedescendant="model.ariaActivedescendant"
      :required="question.isRequired ? true : null"
    >
      <div :class="question.cssClasses.controlValue">
        <sv-tagbox-item
          v-for="(item, index) in question.selectedChoices"
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
        v-show="!question.isEmpty()"
        @click="clear"
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
      <div>{{ question.readOnlyText }}</div>
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
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
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
const clear = (event: any) => {
  model.value?.onClear(event);
};
const keyhandler = (event: any) => {
  model.value?.keyHandler(event);
};
const blur = (event: any) => {
  model.value?.onBlur(event);
};

useBase(() => model.value);
</script>
