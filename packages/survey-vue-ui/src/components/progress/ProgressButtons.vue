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

<script lang="ts" setup>
import { type SurveyModel, SurveyProgressButtonsModel } from "survey-core";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  survey: SurveyModel;
}>();
const progressButtonsModel = new SurveyProgressButtonsModel(props.survey);
const hasScroller = ref(false);
const progressButtonsListContainer = ref<HTMLElement>();
const css = computed(() => props.survey.css);
let updateScroller: any;

const isListElementClickable = (index: any) => {
  return progressButtonsModel.isListElementClickable(index);
};
const getListElementCss = (index: any) => {
  return progressButtonsModel.getListElementCss(index);
};
const clickListElement = (index: any) => {
  progressButtonsModel.clickListElement(index);
};
const getScrollButtonCss = (hasScroller: boolean, isLeftScroll: boolean) => {
  return progressButtonsModel.getScrollButtonCss(hasScroller, isLeftScroll);
};
const clickScrollButton = (isLeftScroll: boolean) => {
  let listContainerElement: any = progressButtonsListContainer.value;
  listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
};

onMounted(() => {
  const listContainerElement: any = progressButtonsListContainer.value;
  updateScroller = setInterval(() => {
    hasScroller.value =
      listContainerElement.scrollWidth > listContainerElement.offsetWidth;
  }, 100);
});
onBeforeUnmount(() => {
  if (typeof updateScroller !== "undefined") {
    clearInterval(updateScroller);
    updateScroller = undefined as any as number;
  }
});
</script>
