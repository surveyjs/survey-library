<template>
 <input
    v-if="item.visible"
    type="button"
    :disabled="item.disabled"
    :value="item.title"
    :class="item.innerCss"
    :title="item.getTooltip()"
    @mousedown="buttonMouseDown"
    @click="item.action"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import { Action } from "survey-core";
import { Base } from "survey-core";
import { BaseVue } from "../../base";

@Component
export class SurveyNavigationButton extends BaseVue {
  @Prop() public item: Action;
  getModel(): Base {
    return this.item;
  }
  buttonMouseDown(): Base {
    return this.item.data && this.item.data.mouseDown();
  }
}

Vue.component("sv-nav-btn", SurveyNavigationButton);
export default SurveyNavigationButton;
</script>
