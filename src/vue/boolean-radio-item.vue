<template>
  <div role="presentation" :class="question.getRadioItemClass(question.cssClasses, value)">
    <label :class="question.cssClasses.radioLabel">
      <input
        type="radio"
        :name="question.name"
        :value="value"
        :checked="value === question.booleanValueRendered"
        :aria-errormessage="question.ariaErrormessage"
        :disabled="question.isInputReadOnly"
        :class="question.cssClasses.itemRadioControl"
        @change="handleChange"
      />
      <span
        v-if="question.cssClasses.materialRadioDecorator"
        :class="question.cssClasses.materialRadioDecorator"
      >
        <svg
          v-if="question.itemSvgIcon"
          :class="question.cssClasses.itemRadioDecorator"
        >
          <use :xlink:href="question.itemSvgIcon"></use>
        </svg>
      </span>
      <span :class="question.cssClasses.radioControlLabel">
        <survey-string :locString="locText" />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { ItemValue, Base } from "survey-core";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BaseVue } from "./base";

@Component
export class BooleanRadioItem extends Vue {
  @Prop() question: any;
  @Prop() locText: any;
  @Prop() value: any;

  handleChange = (event: any) => {
    this.question.booleanValue = event.target.value == "true";
  }
}
Vue.component("sv-boolean-radio-item", BooleanRadioItem);
export default BooleanRadioItem;
</script>
