 <template>
  <div :class="getHeaderClass(element)" @click="function() { if (element.hasInput) element.focus(); return true; }">
    <h5
      v-if="element.hasTitle"
      :class="getTitleClass(element)"
      v-bind:aria-label="element.locTitle.renderedHtml"
      v-bind:id="element.ariaTitleId"
      v-on:click="changeExpanded"
    >
      <span
        v-if="element.isRequireTextOnStart"
        :class="element.cssClasses.requiredText"
        :aria-hidden="true"
      >{{element.requiredText}}</span>
      <span
        v-if="element.no"
        style="position: static;"
        :class="element.cssClasses.number"
        :aria-hidden="true"
      >{{element.no}}</span>
      <span
        v-if="element.isRequireTextBeforeTitle"
        :class="element.cssClasses.requiredText"
        :aria-hidden="true"
      >{{element.requiredText}}</span>
      <survey-string :locString="element.locTitle" />
      <span
        v-if="element.isRequireTextAfterTitle"
        :class="element.cssClasses.requiredText"
        :aria-hidden="true"
      >{{element.requiredText}}</span>

      <span
        v-show="showIcon"
        :class="getIconCss(isCollapsed)"
        v-on:keyup.enter="changeExpanded"
        tabindex="0"
        v-bind:aria-expanded="isCollapsed ? 'false' : 'true'"
        :aria-controls="!isCollapsed ? element.contentId : null"
      ></span>
    </h5>
    <div v-if="element.hasDescriptionUnderTitle" :class="element.cssClasses.description">
      <survey-string :locString="element.locDescription" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "../survey";
import { IElement, IQuestion } from "../base";
import { Question } from "../question";

@Component
export class ElementHeader extends Vue {
  @Prop element: IElement;
  @Prop css: any;

  private isCollapsed: boolean = false;

  mounted() {
    this.isCollapsed = this.element.isCollapsed;

    this.element.stateChangedCallback = () => {
      this.isCollapsed = this.element.isCollapsed;
    }
  }

  beforeDestroy() {
    this.element.stateChangedCallback = null;
  }

  getTitleClass(element: Question) {
    return element.cssTitle;
  }
  getHeaderClass(element: Question) {
    return element.cssHeader;
  }
  changeExpanded() {
    this.element.toggleState();
  }
  get showIcon() {
    return (
      this.element.isExpanded || this.element.isCollapsed
    );
  }
  getIconCss(isCollapsed: boolean) {
    var result = this.css.question.icon;
    if (!isCollapsed) result += " " + this.css.question.iconExpanded;
    return result;
  }
}
Vue.component("survey-element-header", ElementHeader);
export default ElementHeader;
</script>