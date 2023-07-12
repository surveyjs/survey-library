<template>
  <div :class="question.cssClasses.rootCheckbox">
    <div :class="question.getCheckboxItemCss()">
      <label :class="question.cssClasses.checkboxLabel">
        <input
          type="checkbox"
          :name="question.name"
          :value="question.booleanValue ?? ''"
          v-model="question.booleanValue"
          :class="question.cssClasses.controlCheckbox"
          :id="question.inputId"
          :indeterminate.prop="question.isIndeterminate"
          :disabled="question.isInputReadOnly"
          :aria-required="question.ariaRequired"
          :aria-label="question.ariaLabel"
          :aria-invalid="question.ariaInvalid"
          :aria-describedby="question.ariaDescribedBy"
        /><span :class="question.cssClasses.checkboxMaterialDecorator"><svg v-if="question.svgIcon" :class="question.cssClasses.checkboxItemDecorator">
            <use
              :xlink:href="question.svgIcon"
            ></use>
          </svg><span class="check"></span></span><span
          v-if="question.isLabelRendered"
          :id="question.labelRenderedAriaID"
          :class="question.cssClasses.checkboxControlLabel"
        >
          <survey-element-title-content
            v-if="!question.hasTitleActions"
            :element="question"
            :css="css"
          ></survey-element-title-content>
          <sv-title-actions
            v-if="question.hasTitleActions"
            :element="question"
            :css="css"
          ></sv-title-actions>
        </span>
      </label>
    <div
      v-if="question.canRenderLabelDescription"
      :class="question.cssDescription"
    >
      <survey-string :locString="question.locDescription" />
    </div>
    </div>
  </div>
</template>


<script lang="ts">
import { RendererFactory } from "survey-core";
import { QuestionVue } from "./base";
import { BooleanBaseMixin } from "./boolean";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue, BooleanBaseMixin],
  props: { css: Object },
  name: "sv-boolean-checkbox",
});

RendererFactory.Instance.registerRenderer(
  "boolean",
  "checkbox",
  "sv-boolean-checkbox"
);
</script>