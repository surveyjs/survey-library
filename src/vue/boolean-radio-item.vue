<template>
  <div role="presentation" :class="question.getRadioItemClass(question.cssClasses, item.value)">
    <label :class="question.cssClasses.radioLabel">
      <input
        type="radio"
        :name="question.name"
        :value="item.value"
        :checked="item.value === question.value"
        :aria-describedby="question.ariaDescribedBy"
        :disabled="question.isInputReadOnly"
        :class="question.cssClasses.itemControl"
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
        <survey-string :locString="item.locText" />
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
export class BooleanRadioItem extends BaseVue {
  @Prop() question: any;
  @Prop() item: any;
  @Prop() locText: any;
  protected getModel(): Base {
    return this.item;
  }
  handleChange = (event: any) => {
    this.question.value = event.target.value;
  }
}
Vue.component("sv-boolean-radio-item", BooleanRadioItem);
export default BooleanRadioItem;
</script>
