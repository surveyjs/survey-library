<template>
  <label :class="model.css.label" v-bind:title="model.caption.renderedHtml">
    <input
      type="radio"
      v-bind:name="model.name"
      v-bind:id="model.id"
      role="radio"
      v-bind:aria-required="model.isRequired"
      v-bind:aria-label="model.caption.renderedHtml"
      v-bind:aria-invalid="model.hasErrors"
      v-bind:aria-errormessage="model.describedBy"
      :value="model.value"
      v-model="model.question.renderedValue"
      :disabled="model.readOnly"
      :class="model.css.control"
    />
    <div :class="model.css.decorator">
      <sv-svg-icon
        v-if="!!model.iconName"
        :class="model.css.icon"
        :iconName="model.iconName"
        :size="model.iconSize"
      ></sv-svg-icon>
      <span v-if="model.showCaption" :class="model.css.caption">
        <survey-string :locString="model.caption" />
      </span>
    </div>
  </label>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import Vue from "vue";
import {
  ButtonGroupItemModel,
  ItemValue,
  QuestionButtonGroupModel,
} from "survey-core";
import { BaseVue } from "./base";
@Component
export class ButtonGroupItem extends BaseVue {
  @Prop() item: ItemValue;
  @Prop() question: QuestionButtonGroupModel;
  @Prop() index: number;
  public model: ButtonGroupItemModel;

  constructor(props: any) {
    super(props);
    this.model = new ButtonGroupItemModel(this.question, this.item, this.index);
  }
  getModel(): ItemValue {
    return this.item;
  }
}

Vue.component("sv-button-group-item", ButtonGroupItem);
export default ButtonGroupItem;
</script>
