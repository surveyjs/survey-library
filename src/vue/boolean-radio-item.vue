<template>
  <div role="presentation" :class="question.cssClasses.radioItem">
    <label>
      <input
        type="radio"
        :name="question.name"
        :checked="item.value === question.value"
        :aria-describedby="question.ariaDescribedBy"
        :disabled="question.isInputReadOnly"
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
      <span>
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
}
Vue.component("sv-boolean-radio-item", BooleanRadioItem);
export default BooleanRadioItem;
</script>
