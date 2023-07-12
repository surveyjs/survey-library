<template>
  <div :class="question.cssClasses.selectWrapper">
    <div
      v-if="!question.isReadOnly"
      :id="question.inputId"
      :tabindex="model.inputReadOnly ? undefined : 0"
      :disabled="question.isInputReadOnly ? true : null"
      @click="click"
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
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { BaseVue } from "../../base";
import { DropdownMultiSelectListModel, QuestionTagboxModel } from "survey-core";

export default defineComponent({
  props: {
    question: Object as PropType<QuestionTagboxModel>,
  },
  mixins: [BaseVue],
  name: "sv-tagbox",
  data: (vm: any) => {
    return {
      inputElement: undefined,
      getModel: () => {
        return vm.question.dropdownListModel;
      },
    };
  },
  computed: {
    model() {
      return this.question.dropdownListModel;
    },
  },
  methods: {
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
    if (!this.question.dropdownListModel) {
      // eslint-disable-next-line vue/no-mutating-props
      this.question.dropdownListModel = new DropdownMultiSelectListModel(this.question);
    }
  },
});
</script>
