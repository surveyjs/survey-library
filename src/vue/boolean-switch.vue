<template>
  <div :class="question.cssClasses.root" v-on:keydown="question.onKeyDownCore($event)">
    <label :class="question.getItemCss()">
      <input
        type="checkbox"
        :name="question.name"
        :value="question.booleanValue"
        v-model="question.booleanValue"
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
          <span v-if="question.cssClasses.sliderText && question.isDeterminated" :class="question.cssClasses.sliderText">
            <survey-string :locString="question.getCheckedLabel()"></survey-string>
          </span>
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
