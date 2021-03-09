<template>
  <div>
    <survey-question-title-content
      :element="element"
      :css="css"
    ></survey-question-title-content>
    <span
      v-show="showIcon"
      :class="getIconCss(isCollapsed)"
      v-on:keyup.enter="changeExpanded"
      tabindex="0"
      v-bind:aria-expanded="isCollapsed ? 'false' : 'true'"
      :aria-controls="!isCollapsed ? element.contentId : null"
    ></span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component
export class DefaultTitle extends Vue {
  @Prop() element: any;
  @Prop() css: any;
  get showIcon() {
    return this.element.isExpanded || this.element.isCollapsed;
  }

  private isCollapsed: boolean = false;

  changeExpanded() {
    this.element.toggleState();
  }

  getIconCss(isCollapsed: boolean) {
    var result = this.css.question.icon;
    if (!isCollapsed) result += " " + this.css.question.iconExpanded;
    return result;
  }

  mounted() {
    this.isCollapsed = this.element.isCollapsed;

    this.element.stateChangedCallback = () => {
      this.isCollapsed = this.element.isCollapsed;
    };
  }
}

Vue.component("sv-default-title", DefaultTitle);
export default DefaultTitle;
</script>
