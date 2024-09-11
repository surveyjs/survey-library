<template>
  <div :class="question.cssClasses.rootCheckbox" ref="root">
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
          :disabled="question.isDisabledAttr"
          :readonly="question.isReadOnlyAttr"
          :aria-required="question.ariaRequired"
          :aria-label="question.ariaLabel"
          :aria-invalid="question.ariaInvalid"
          :aria-errormessage="question.ariaErrormessage"
        />
        <span :class="question.cssClasses.checkboxMaterialDecorator">
          <svg
            v-if="question.svgIcon"
            :class="question.cssClasses.checkboxItemDecorator"
          >
            <use :xlink:href="question.svgIcon"></use>
          </svg>
          <span class="check"></span>
        </span>
        <span
          v-if="question.isLabelRendered"
          :id="question.labelRenderedAriaID"
          :class="question.cssClasses.checkboxControlLabel"
        >
          <SvComponent
            :is="'survey-element-title-content'"
            v-if="!question.hasTitleActions"
            :element="question"
            :css="css"
          ></SvComponent>
          <SvComponent
            :is="'sv-title-actions'"
            v-if="question.hasTitleActions"
            :element="question"
            :css="css"
          ></SvComponent>
        </span>
      </label>
      <div
        v-if="question.canRenderLabelDescription"
        :class="question.cssDescription"
        :id="question.ariaDescriptionId"
      >
        <SvComponent
          :is="'survey-string'"
          :locString="question.locDescription"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import SvComponent from "@/SvComponent.vue";
import { RendererFactory } from "survey-core";
import type { IBooleanProps } from "./boolean";
import { ref } from "vue";
import { useQuestion } from "./base";
defineOptions({ inheritAttrs: false });
const props = defineProps<IBooleanProps & { css?: any }>();
const root = ref(null);
useQuestion(props, root);
</script>

<script lang="ts">
RendererFactory.Instance.registerRenderer(
  "boolean",
  "checkbox",
  "sv-boolean-checkbox"
);
</script>
