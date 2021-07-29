<template>
  <div
    v-if="question.isVisible"
    :class="question.cssClasses.panel.container"
    :style="rootStyle"
  >
    <h4
      v-show="hasTitle"
      :class="question.cssTitle"
      v-bind:tabindex="question.titleTabIndex"
      v-bind:aria-expanded="question.titleAriaExpanded"
      v-on:click="
        () => {
          return question.toggleState();
        }
      "
      v-on:keyup="
        ($event) => {
          keyup($event);
        }
      "
    >
      <component
        :is="question.getTitleComponentName()"
        :element="question"
        :css="css"
      ></component>
    </h4>
    <div :class="question.cssClasses.panel.description">
      <survey-string :locString="question.locDescription" />
    </div>
    <survey-errors :question="question" />
    <div
      :id="question.contentId"
      :style="{ paddingLeft: question.innerPaddingLeft }"
      v-if="!isCollapsed"
      :class="question.cssClasses.panel.content"
    >
      <div
        v-for="(row, index) in rows"
        :key="question.id + '_' + index"
        v-if="row.visible"
        :class="css.row"
      >
        <survey-row :row="row" :survey="survey" :css="css"></survey-row>
      </div>
      <div
        v-if="question.hasEditButton"
        :class="question.cssClasses.panel.footer"
      >
        <input
          type="button"
          :value="survey.editText"
          :class="survey.cssNavigationEdit"
          @click="cancelPreview"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { PanelModel, Base, CssClassBuilder, doKey2Click } from "survey-core";
import { BaseVue } from "./base";

@Component
export class Panel extends BaseVue {
  @Prop() question: PanelModel;
  @Prop() isEditMode: Boolean;
  @Prop() css: any;

  private isCollapsed: boolean = false;

  protected getModel(): Base {
    return this.question;
  }
  protected onMounted() {
    if (this.question.survey) {
      this.question.survey.afterRenderPanel(
        this.question,
        this.$el as HTMLElement
      );
    }
    this.isCollapsed = this.question.isCollapsed;

    this.question.stateChangedCallback = () => {
      this.isCollapsed = this.question.isCollapsed;
    };
  }
  beforeDestroy() {
    this.question.stateChangedCallback = null;
  }
  get rootStyle() {
    var result = {};
    if (this.question.renderWidth) {
      (<any>result)["flexBasis"] = this.question.renderWidth;
      (<any>result)["flexGrow"] = 1;
      (<any>result)["flexShrink"] = 1;
      (<any>result)["width"] = this.question.renderWidth;
      (<any>result)["minWidth"] = this.question.minWidth;
      (<any>result)["maxWidth"] = this.question.maxWidth;
    }
    return result;
  }
  get showIcon() {
    return this.question.isExpanded || this.question.isCollapsed;
  }
  get rows() {
    return this.question.rows;
  }
  get hasTitle() {
    return this.question.title.length > 0;
  }
  get survey() {
    return this.question.survey;
  }
  get iconCss() {
    return new CssClassBuilder()
      .append(this.css.panel.icon)
      .append(this.css.panel.iconExpanded, !this.isCollapsed)
      .toString();
  }
  keyup(evt: any) {
    doKey2Click(evt);
  }
  cancelPreview() {
    this.question.cancelPreview();
  }
  get requiredTextCss() {
    return (
      this.question.cssClasses.requiredText ||
      this.question.cssClasses.panel.requiredText
    );
  }
}
Vue.component("survey-panel", Panel);
export default Panel;
</script>
