<template>
  <div
    :class="question.cssClasses.root"
    ref="root"
    v-on:keydown="question.onKeyDownCore($event)"
  >
    <label :class="question.getItemCss()">
      <input
        type="checkbox"
        :name="question.name"
        :value="question.booleanValue ?? ''"
        v-model="question.booleanValue"
        :class="question.cssClasses.control"
        :id="question.inputId"
        :indeterminate.prop="question.isIndeterminate"
        :disabled="question.isInputReadOnly"
        :role="question.a11y_input_ariaRole"
        :aria-required="question.a11y_input_ariaRequired"
        :aria-label="question.a11y_input_ariaLabel"
        :aria-labelledby="question.a11y_input_ariaLabelledBy"
        :aria-invalid="question.a11y_input_ariaInvalid"
        :aria-describedby="question.a11y_input_ariaDescribedBy"
      />
      <div
        :class="question.cssClasses.sliderGhost"
        v-on:click="onLabelClick($event, question.exchangeUIButtons)"
      >
        <span :class="question.getLabelCss(question.exchangeUIButtons)"
          ><survey-string :locString="question.locLabelLeft"></survey-string
        ></span>
      </div>
      <div
        :class="question.cssClasses.switch"
        v-on:click="onSwitchClick($event)"
      >
        <span :class="question.cssClasses.slider">
          <span
            v-if="question.cssClasses.sliderText && question.isDeterminated"
            :class="question.cssClasses.sliderText"
          >
            <survey-string
              :locString="question.getCheckedLabel()"
            ></survey-string>
          </span>
        </span>
      </div>
      <div
        :class="question.cssClasses.sliderGhost"
        v-on:click="onLabelClick($event, !question.exchangeUIButtons)"
      >
        <span :class="question.getLabelCss(!question.exchangeUIButtons)"
          ><survey-string :locString="question.locLabelRight"></survey-string
        ></span>
      </div>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { useQuestion } from "./base";
import { ref } from "vue";
import type { IBooleanProps } from "./boolean";
defineOptions({ inheritAttrs: false });
const props = defineProps<IBooleanProps>();
const root = ref(null);
useQuestion(props, root);
const onLabelClick = (event: any, value: boolean) => {
  props.question.onLabelClick(event, value);
};
const onSwitchClick = (event: any) => {
  props.question.onSwitchClickModel(event);
};
</script>
