<template>
  <div :class="question.cssClasses.root">
    <label :class="itemClass">
      <input
        type="checkbox"
        :name="question.name"
        :value="question.checkedValue"
        v-model="question.checkedValue"
        :class="question.cssClasses.control"
        :id="question.inputId"
        :indeterminate.prop="question.isIndeterminate"
        :disabled="question.isReadOnly"
        v-bind:aria-required="question.isRequired"
        :aria-label="question.locTitle.renderedHtml"
        :aria-invalid="question.errors.length > 0"
        :aria-describedby="
          question.errors.length > 0 ? question.id + '_errors' : null
        "
      />
      <span
        :class="getLabelClass(false)"
        v-on:click="onLabelClick($event, false)"
        ><survey-string :locString="question.locLabelFalse"></survey-string
      ></span>
      <div
        :class="question.cssClasses.switch"
        v-on:click="onSwitchClick($event)"
      >
        <span :class="question.cssClasses.slider" />
      </div>
      <span :class="getLabelClass(true)" v-on:click="onLabelClick($event, true)"
        ><survey-string :locString="question.locLabelTrue"></survey-string
      ></span>
    </label>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { default as QuestionVue } from "./question";
import { QuestionBooleanModel } from "survey-core";
import { Boolean } from "./boolean";

@Component
export class BooleanSwitch extends Boolean {}

Vue.component("survey-boolean", BooleanSwitch);

export default BooleanSwitch;
</script>
