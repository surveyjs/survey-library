<template>
  <div :class="question.cssClasses.selectWrapper" @click="click">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :disabled="question.isDisabledAttr ? true : null"
      :tabindex="model.noTabIndex ? undefined : 0"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="question.ariaRole"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-errormessage="question.ariaErrormessage"
      :aria-expanded="question.ariaExpanded"
      :aria-controls="model.listElementId"
      :aria-activedescendant="model.ariaActivedescendant"
      :required="question.isRequired ? true : null"
    >
      <div v-if="model.showHintPrefix" :class="question.cssClasses.hintPrefix">
        <span>{{ model.hintStringPrefix }}</span>
      </div>

      <div :class="question.cssClasses.controlValue">
        <SvComponent
          :is="'survey-string'"
          v-if="showSelectedItemLocText"
          :locString="selectedItemLocText"
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
        <SvComponent
          v-if="question.showInputFieldComponent"
          :is="question.inputFieldComponentName"
          :item="model.getSelectedAction()"
          :question="question"
        >
        </SvComponent>
        <input
          type="text"
          ref="inputElement"
          v-bind:class="question.cssClasses.filterStringInput"
          v-bind:disabled="question.isDisabledAttr"
          autocomplete="off"
          :inputmode="model.inputMode"
          :role="model.filterStringEnabled ? question.ariaRole : undefined"
          :id="question.getInputId()"
          :tabindex="model.noTabIndex ? undefined : -1"
          :readonly="model.filterReadOnly ? true : undefined"
          :aria-expanded="question.ariaExpanded"
          :aria-controls="model.listElementId"
          :aria-label="question.a11y_input_ariaLabel"
          :aria-labelledby="question.a11y_input_ariaLabelledBy"
          :aria-describedby="question.a11y_input_ariaDescribedBy"
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
        v-show="question.showClearButton"
        @click="clear"
        aria-hidden="true"
      >
        <SvComponent
          :is="'sv-svg-icon'"
          :class="question.cssClasses.cleanButtonSvg"
          :iconName="question.cssClasses.cleanButtonIconId"
          :title="question.clearCaption"
          size="auto"
        >
        </SvComponent>
      </div>
    </div>
    <SvComponent
      :is="'sv-popup'"
      v-if="!question.isReadOnly"
      :model="question.dropdownListModel.popupModel"
    ></SvComponent>
    <div
      v-else
      :id="question.inputId"
      :aria-label="question.a11y_input_ariaLabel"
      :aria-labelledby="question.a11y_input_ariaLabelledBy"
      :aria-describedby="question.a11y_input_ariaDescribedBy"
      :tabindex="question.isDisabledAttr ? undefined : 0"
      :class="question.getControlClass()"
    >
      <SvComponent
        :is="'survey-string'"
        v-if="question.selectedItemLocText"
        :locString="question.selectedItemLocText"
      />
      <div>{{ question.readOnlyText }}</div>
    </div>
    <div
      :class="question.cssClasses.chevronButton"
      v-on:pointerdown="chevronPointerDown"
      v-if="question.cssClasses.chevronButtonIconId"
      aria-hidden="true"
    >
      <SvComponent
        :is="'sv-svg-icon'"
        :class="question.cssClasses.chevronButtonSvg"
        :iconName="question.cssClasses.chevronButtonIconId"
        size="auto"
      >
      </SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { useBase } from "@/base";
import { Question, Helpers } from "survey-core";
import { computed, onMounted, onUpdated, ref } from "vue";

const props = defineProps<{ question: Question }>();
const inputElement = ref<HTMLElement>(null as any);
const model = computed(() => {
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
const updateInputDomElement = () => {
  if (inputElement.value) {
    const control: any = inputElement.value;
    const newValue = model.value.inputStringRendered;
    if (
      !Helpers.isTwoValueEquals(newValue, control.value, false, true, false)
    ) {
      control.value = model.value.inputStringRendered;
    }
  }
};
const blur = (event: any) => {
  props.question.onBlur(event);
  updateInputDomElement();
};
const focus = (event: any) => {
  props.question.onFocus(event);
};
const inputChange = (event: any) => {
  model.value.inputStringRendered = event.target.value;
};

const showSelectedItemLocText = computed(
  () => props.question.showSelectedItemLocText
);
const selectedItemLocText = computed(() => props.question.selectedItemLocText);

useBase(() => model.value);

onUpdated(updateInputDomElement);
onMounted(updateInputDomElement);
</script>
