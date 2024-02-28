<template>
        <div
         :class="question.cssClasses.hint"
        >
          <div v-if="model.showHintPrefix" :class="question.cssClasses.hintPrefix">
            <span>{{ model.hintStringPrefix }}</span>
          </div>

          <div :class="question.cssClasses.hintSuffixWrapper">
              <survey-string
                v-if="question.showSelectedItemLocText"
                :locString="question.selectedItemLocText"
              />
              <div v-if="model.showHintString" :class="question.cssClasses.hintSuffix">
              <span style="visibility: hidden">{{ model.inputStringRendered }}</span>
              <span>{{ model.hintStringSuffix }}</span>
              </div>
              <input
                type="text"
                autocomplete="off"
                v-model="model.inputStringRendered"
                v-bind:class="question.cssClasses.filterStringInput"
                v-bind:placeholder="model.filterStringPlaceholder"
                v-bind:disabled="question.isInputReadOnly"
                :inputmode="model.inputMode"
                :role="model.filterStringEnabled ? question.ariaRole : null"
                :aria-expanded="question.ariaExpanded"
                :aria-label="question.a11y_input_ariaLabel"
                :aria-labelledby="question.a11y_input_ariaLabelledBy"
                :aria-describedby="question.a11y_input_ariaDescribedBy"
                :aria-controls="model.listElementId"
                :aria-activedescendant="model.ariaActivedescendant"
                :id="question.getInputId()"
                :readonly="model.filterReadOnly ? true : null"
                :size="!model.inputStringRendered ? 1 : null"
                @change="inputChange"
                @keydown="inputKeyHandler"
                @blur="blur"
                @focus="focus"
              />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { DropdownMultiSelectListModel, QuestionTagboxModel } from "survey-core";
import BaseVue from "../../base";

@Component
export class TagboxFilterComponent extends BaseVue {
  @Prop() model: DropdownMultiSelectListModel;
  @Prop() question: QuestionTagboxModel;

  getModel() {
    return this.model;
  }

  inputChange(event: any) {
    this.model.inputStringRendered = event.target.value;
  }
  inputKeyHandler(event: any) {
    this.model.inputKeyHandler(event);
  }
  public blur(event: any) {
    this.model.onBlur(event);
  }
  public focus(event: any) {
    this.model.onFocus(event);
  }
}

Vue.component("sv-tagbox-filter", TagboxFilterComponent);
export default TagboxFilterComponent;
</script>
