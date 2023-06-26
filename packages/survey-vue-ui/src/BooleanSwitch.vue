<template>
  <div :class="question.cssClasses.root" v-on:keydown="question.onKeyDownCore($event)">
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
      <span
        :class="question.getLabelCss(false)"
        ><survey-string :locString="question.locLabelFalse"></survey-string
      ></span>
      </div>
      <div
        :class="question.cssClasses.switch"
        v-on:click="onSwitchClick($event)"
      >
        <span :class="question.cssClasses.slider">
          <span v-if="question.cssClasses.sliderText && question.isDeterminated" :class="question.cssClasses.sliderText">
            <survey-string :locString="question.getCheckedLabel()"></survey-string>
          </span>
        </span>
      </div>
      <div
        :class="question.cssClasses.sliderGhost"
        v-on:click="onLabelClick($event, true)"
      ><span :class="question.getLabelCss(true)"
        ><survey-string :locString="question.locLabelTrue"></survey-string
      ></span>
      </div>
    </label>
  </div>
</template>

<script lang="ts">
import { QuestionVue } from "./base";
import { BooleanBaseMixin } from "./boolean";
import { defineComponent } from "vue";

export default defineComponent({
  // eslint-disable-next-line
  mixins: [QuestionVue, BooleanBaseMixin],
  name: "survey-boolean",
});
</script>