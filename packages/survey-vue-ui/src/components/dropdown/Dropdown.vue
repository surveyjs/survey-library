<template>
  <div :class="question.cssClasses.selectWrapper">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :disabled="question.isInputReadOnly ? true : null"
      :tabindex="model.inputReadOnly ? undefined : 0"
      @click="click"
      @keydown="keyhandler"
      @blur="blur"
      :class="question.getControlClass()"
      :role="question.ariaRole"
      :aria-required="question.ariaRequired"
      :aria-label="question.ariaLabel"
      :aria-invalid="question.ariaInvalid"
      :aria-describedby="question.ariaDescribedBy"
      :aria-expanded="question.ariaExpanded ? 'true' : 'false'"
      :aria-controls="model.listElementId"
      :aria-activedescendant="model.ariaActivedescendant"
      :required="question.isRequired"
    >
      <div v-if="model.showHintPrefix" :class="question.cssClasses.hintPrefix">
        <span>{{ model.hintStringPrefix }}</span>
      </div>

      <div :class="question.cssClasses.controlValue">
        <survey-string
          v-if="question.showSelectedItemLocText"
          :locString="question.selectedItemLocText"
        />
        <div v-if="model.showHintString" :class="question.cssClasses.hintSuffix">
          <span style="visibility: hidden">{{ model.inputStringRendered }}</span>
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
          :role="model.filterStringEnabled ? question.ariaRole : null"
          :id="question.getInputId()"
          :tabindex="model.inputReadOnly ? undefined : -1"
          :readonly="!model.searchEnabled ? true : null"
          :aria-label="question.placeholder"
          :aria-expanded="question.ariaExpanded ? 'true' : 'false'"
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
    <div disabled v-else :id="question.inputId" :class="question.getControlClass()">
      <survey-string
        v-if="question.selectedItemLocText"
        :locString="question.selectedItemLocText"
      />
      <div>{{ question.readOnlyText }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineSurveyComponent } from "../../base";
import { DropdownListModel, QuestionDropdownModel, Helpers } from "survey-core";

export default defineSurveyComponent({
  props: {
    question: Object as PropType<QuestionDropdownModel>,
  },
  name: "sv-dropdown",
  data: (vm: any) => {
    return {
      inputElement: undefined,
      getModel: () => {
        if (!vm.question.dropdownListModel) {
          vm.question.dropdownListModel = new DropdownListModel(vm.question);
        }
        return vm.model;
      },
    };
  },
  computed: {
    model() {
      return this.question.dropdownListModel;
    },
  },
  updated() {
    this.updateInputDomElement();
  },
  mounted() {
    this.inputElement = this.$refs["inputElement"];
    this.updateInputDomElement();
  },
  methods: {
    inputChange(event: any) {
      this.model.inputStringRendered = event.target.value;
    },
    updateInputDomElement() {
      if (this.inputElement) {
        const control: any = this.inputElement;
        const newValue = this.model.inputStringRendered;
        if (!Helpers.isTwoValueEquals(newValue, control.value)) {
          control.value = this.model.inputStringRendered;
        }
      }
    },
    click(event: any) {
      this.model?.onClick(event);
    },
    clear(event: any) {
      this.model?.onClear(event);
    },
    keyhandler(event: any) {
      this.model?.keyHandler(event);
    },
    blur(event: any) {
      this.model?.onBlur(event);
      this.updateInputDomElement();
    },
    focus(event: any) {
      this.model?.onFocus(event);
    },
  },
});
</script>
