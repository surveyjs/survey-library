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
        <sv-tagbox-filter :model="model" :question="question"></sv-tagbox-filter>
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
    <div disabled v-else :id="question.inputId" :class="question.getControlClass()">
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

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { BaseVue } from "../../base";
import { DropdownMultiSelectListModel, QuestionTagboxModel } from "survey-core";

export default defineComponent({
  props: {
    question: { type: Object as PropType<QuestionTagboxModel>, required: true },
  },
  mixins: [BaseVue],
  name: "sv-tagbox",
  computed: {
    model() {
      return this.question.dropdownListModel;
    },
  },
  methods: {
    getModel() {
      return this.model;
    },
    inputChange(event: any) {
      this.model.filterString = event.target.value;
    },
    click(event: any) {
      this.question.dropdownListModel?.onClick(event);
    },
    clear(event: any) {
      this.question.dropdownListModel?.onClear(event);
    },
    keyhandler(event: any) {
      this.question.dropdownListModel?.keyHandler(event);
    },
    blur(event: any) {
      this.question.dropdownListModel?.onBlur(event);
    },
  },
  created() {
    const question = this.question;
    if (!question.dropdownListModel) {
      question.dropdownListModel = new DropdownMultiSelectListModel(this.question);
    }
  },
});
</script>
