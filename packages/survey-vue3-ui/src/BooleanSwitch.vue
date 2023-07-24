<template>
  <div
    :class="question.cssClasses.root"
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
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
      />
      <div
        :class="question.cssClasses.sliderGhost"
        v-on:click="onLabelClick($event, false)"
      >
        <span :class="question.getLabelCss(false)"
          ><survey-string :locString="question.locLabelFalse"></survey-string
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
        v-on:click="onLabelClick($event, true)"
      >
        <span :class="question.getLabelCss(true)"
          ><survey-string :locString="question.locLabelTrue"></survey-string
        ></span>
      </div>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { useQuestion } from "./base";
import { ref } from "vue";
import type { IBooleanProps } from "./boolean";
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
