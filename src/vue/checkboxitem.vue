<template>
  <div role="presentation" :class="question.getItemClass(item)">
    <label :class="question.getLabelClass(item)">
      <input
        type="checkbox" role="option" :name="question.name+item.id"
        :checked="question.isItemSelected(item)"
        @input="
          (e) => {
            question.clickItemHandler(item, e.target.checked);
          }
        "
        :value="item.value"
        :id="question.getItemId(item)" :disabled="!question.getItemEnabled(item)"
        :class="question.cssClasses.itemControl" /><span
        v-if="question.cssClasses.materialDecorator" :class="question.cssClasses.materialDecorator">
        <svg v-if="question.itemSvgIcon" :class="question.cssClasses.itemDecorator">
          <use :xlink:href="question.itemSvgIcon"></use>
        </svg>
      </span><span v-if="!hideLabel" :class="question.cssClasses.controlLabel">
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
export class CheckboxItem extends BaseVue {
  @Prop() question: any;
  @Prop() item: ItemValue;
  @Prop() hideLabel: boolean;
  protected getModel(): Base {
    return this.item;
  }
}
Vue.component("survey-checkbox-item", CheckboxItem);
export default CheckboxItem;
</script>
