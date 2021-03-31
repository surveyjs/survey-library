<template>
  <label :class="model.css.label" v-bind:title="model.caption.renderedHtml">
    <input
      type="radio"
      v-bind:name="model.name"
      v-bind:id="model.id"
      v-bind:aria-required="model.isRequired"
      v-bind:aria-label="model.caption.renderedHtml"
      role="radio"
      v-bind:aria-invalid="model.hasErrors"
      v-bind:aria-describedby="model.describeBy"
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
import { ButtonGroupItemModel } from "survey-core";
import { BaseVue } from "src/vue/base";
@Component
export class ButtonGroupItemViewModel extends BaseVue {
  @Prop() model: ButtonGroupItemModel;

  getModel(): ButtonGroupItemModel {
    return this.model;
  }
}

Vue.component("sv-button-group-item", ButtonGroupItemViewModel);
export default ButtonGroupItemViewModel;
</script>
