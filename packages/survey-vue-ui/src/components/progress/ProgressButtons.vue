<template>
  <div :class="css.progressButtonsContainerCenter">
    <div :class="css.progressButtonsContainer">
      <div
        :class="getScrollButtonCss(hasScroller, true)"
        v-on:click="clickScrollButton(true)"
        role="button"
      ></div>
      <div
        :class="css.progressButtonsListContainer"
        ref="progressButtonsListContainer"
      >
        <ul :class="css.progressButtonsList">
          <li
            v-for="(page, index) in survey.visiblePages"
            :key="'listelement' + index"
            :class="getListElementCss(index)"
            v-on:click="
              isListElementClickable(index) ? clickListElement(index) : null
            "
          >
            <div
              :class="css.progressButtonsPageTitle"
              :title="page.locNavigationTitle.renderedHtml || page.name"
            >
              {{ page.locNavigationTitle.renderedHtml || page.name }}
            </div>
            <div
              :class="css.progressButtonsPageDescription"
              :title="page.locNavigationDescription.renderedHtml"
            >
              {{ page.locNavigationDescription.renderedHtml }}
            </div>
          </li>
        </ul>
      </div>
      <div
        :class="getScrollButtonCss(hasScroller, false)"
        v-on:click="clickScrollButton(false)"
        role="button"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { type SurveyModel, SurveyProgressButtonsModel } from "survey-core";
import { ref, type PropType, defineComponent } from "vue";

export default defineComponent({
  props: {
    survey: { type: Object as PropType<SurveyModel>, required: true },
  },
  setup(props) {
    return {
      progressButtonsModel: new SurveyProgressButtonsModel(props.survey),
      hasScroller: ref(false),
      updateScroller: undefined as any as number,
    };
  },
  computed: {
    css() {
      return this.survey.css;
    },
  },
  mounted() {
    const listContainerElement: any =
      this.$refs["progressButtonsListContainer"];
    this.updateScroller = setInterval(() => {
      this.hasScroller =
        listContainerElement.scrollWidth > listContainerElement.offsetWidth;
    }, 100);
  },
  methods: {
    isListElementClickable(index: any): boolean {
      return this.progressButtonsModel.isListElementClickable(index);
    },
    getListElementCss(index: any): string {
      return this.progressButtonsModel.getListElementCss(index);
    },
    clickListElement(index: any): void {
      this.progressButtonsModel.clickListElement(index);
    },
    getScrollButtonCss(hasScroller: boolean, isLeftScroll: boolean): any {
      return this.progressButtonsModel.getScrollButtonCss(
        hasScroller,
        isLeftScroll
      );
    },
    clickScrollButton(isLeftScroll: boolean): void {
      let listContainerElement: any =
        this.$refs["progressButtonsListContainer"];
      listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
    },
  },
  beforeUnmount() {
    if (typeof this.updateScroller !== "undefined") {
      clearInterval(this.updateScroller);
      this.updateScroller = undefined as any as number;
    }
  },
});
</script>
