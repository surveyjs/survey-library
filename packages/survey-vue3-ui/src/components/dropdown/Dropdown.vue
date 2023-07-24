<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :disabled="question.isInputReadOnly ? true : null"
      :tabindex="model.inputReadOnly ? undefined : 0"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="question.ariaRole"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
      :aria-expanded="
        question.ariaExpanded === null
          ? undefined
          : question.ariaExpanded === 'true'
      "
      :aria-controls="model.listElementId"
      :aria-activedescendant="model.ariaActivedescendant"
      :required="question.isRequired ? true : null"
    >
      <div v-if="model.showHintPrefix" :class="question.cssClasses.hintPrefix">
        <span>{{ model.hintStringPrefix }}</span>
      </div>

      <div :class="question.cssClasses.controlValue">
        <survey-string
          v-if="question.showSelectedItemLocText"
          :locString="question.selectedItemLocText"
        />
        <div
          v-if="model.showHintString"
          :class="question.cssClasses.hintSuffix"
        >
          <span style="visibility: hidden">{{
            model.inputStringRendered
          }}</span>
          <span>{{ model.hintStringSuffix }}</span>
        </div>
        <component
          v-if="question.showInputFieldComponent"
          :is="question.inputFieldComponentName"
          :item="model.getSelectedAction()"
          :question="question"
        >
        </component>
        <input
          type="text"
          ref="inputElement"
          v-bind:class="question.cssClasses.filterStringInput"
          v-bind:disabled="question.isInputReadOnly"
          autocomplete="off"
          :inputmode="model.inputMode"
          :role="model.filterStringEnabled ? question.ariaRole : undefined"
          :id="question.getInputId()"
          :tabindex="model.inputReadOnly ? undefined : -1"
          :readonly="!model.searchEnabled ? true : undefined"
          :aria-label="question.placeholder"
          :aria-expanded="
            question.ariaExpanded === null
              ? undefined
              : question.ariaExpanded === 'true'
          "
          :aria-controls="model.listElementId"
          :aria-activedescendant="model.ariaActivedescendant"
          :placeholder="model.placeholderRendered"
          @input="inputChange"
          @blur="blur"
          @focus="focus"
        />
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
    <sv-popup
      v-if="!question.isReadOnly"
      :model="question.dropdownListModel.popupModel"
    ></sv-popup>
    <div
      disabled
      v-else
      :id="question.inputId"
      :class="question.getControlClass()"
    >
      <survey-string
        v-if="question.selectedItemLocText"
        :locString="question.selectedItemLocText"
      />
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
import { DropdownListModel, Question, Helpers } from "survey-core";
import { computed, onMounted, onUpdated, ref } from "vue";

const props = defineProps<{ question: Question }>();
const inputElement = ref<HTMLElement>(null as any);
const model = computed(() => {
  const question = props.question;
  if (!question.dropdownListModel) {
    question.dropdownListModel = new DropdownListModel(question);
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
const updateInputDomElement = () => {
  if (inputElement.value) {
    const control: any = inputElement.value;
    const newValue = model.value.inputStringRendered;
    if (!Helpers.isTwoValueEquals(newValue, control.value)) {
      control.value = model.value.inputStringRendered;
    }
  }
};
const blur = (event: any) => {
  model.value?.onBlur(event);
  updateInputDomElement();
};
const focus = (event: any) => {
  model.value?.onFocus(event);
};
const inputChange = (event: any) => {
  model.value.inputStringRendered = event.target.value;
};

useBase(() => model.value);

onUpdated(updateInputDomElement);
onMounted(updateInputDomElement);
</script>
