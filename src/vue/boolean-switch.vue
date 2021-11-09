<template>
  <div :class="question.cssClasses.root">
    <label :class="question.getItemCss()">
      <input
        type="checkbox"
        :name="question.name"
        :value="question.checkedValue"
        v-model="question.checkedValue"
        :class="question.cssClasses.control"
        :id="question.inputId"
        :indeterminate.prop="question.isIndeterminate"
        :disabled="question.isInputReadOnly"
        :aria-required="question.ariaRequired"
        :aria-label="question.ariaLabel"
        :aria-invalid="question.ariaInvalid"
        :aria-describedby="question.ariaDescribedBy"
      /><span
        :class="question.getLabelCss(false)"
        v-on:click="onLabelClick($event, false)"
        ><survey-string :locString="question.locLabelFalse"></survey-string
      ></span><div
        :class="question.cssClasses.switch"
        v-on:click="onSwitchClick($event)"
      >
        <span :class="question.cssClasses.slider">
          <span :class="question.cssClasses.sliderText">
            <survey-string v-if="question.checkedValue === false" :locString="question.locLabelFalse"></survey-string
      ><survey-string v-if="question.checkedValue === true" :locString="question.locLabelTrue"></survey-string
      ></span>
      </span>
      </div><span :class="question.getLabelCss(true)" v-on:click="onLabelClick($event, true)"
        ><survey-string :locString="question.locLabelTrue"></survey-string
      ></span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Boolean } from "./boolean";

@Component
export class BooleanSwitch extends Boolean {}

Vue.component("survey-boolean", BooleanSwitch);

export default BooleanSwitch;
</script>
