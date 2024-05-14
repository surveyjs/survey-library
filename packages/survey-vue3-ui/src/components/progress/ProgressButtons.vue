<template>
  <div
    :class="model.getRootCss(container)"
    :style="{ maxWidth: model.progressWidth }"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="progress"
  >
    <div v-if="canShowHeader" :class="survey.css.progressButtonsHeader">
      <div
        :class="survey.css.progressButtonsPageTitle"
        :title="model.headerText"
      >
        {{ model.headerText }}
      </div>
    </div>
    <div :class="css.progressButtonsContainer">
      <div
        :class="model.getScrollButtonCss(hasScroller, true)"
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
            :class="model.getListElementCss(index)"
            v-on:click="
              model.isListElementClickable(index)
                ? model.clickListElement(page)
                : null
            "
            :data-page-number="model.getItemNumber(page)"
          >
            <div :class="css.progressButtonsConnector"></div>
            <div
              v-if="canShowItemTitles"
              :class="css.progressButtonsPageTitle"
              :title="page.renderedNavigationTitle"
            >
              <survey-string :locString="page.locNavigationTitle" />
            </div>
            <div
              v-if="canShowItemTitles"
              :class="css.progressButtonsPageDescription"
              :title="page.locNavigationDescription.renderedHtml"
            >
              {{ page.locNavigationDescription.renderedHtml }}
            </div>
            <div :class="css.progressButtonsButton">
              <div :class="css.progressButtonsButtonBackground"></div>
              <div :class="css.progressButtonsButtonContent"></div>
              <span>{{ model.getItemNumber(page) }}</span>
            </div>
          </li>
        </ul>
      </div>
      <div
        :class="model.getScrollButtonCss(hasScroller, false)"
        v-on:click="clickScrollButton(false)"
        role="button"
      ></div>
    </div>
    <div v-if="canShowFooter" :class="survey.css.progressButtonsFooter">
      <div
        :class="survey.css.progressButtonsPageTitle"
        :title="model.footerText"
      >
        {{ model.footerText }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  type SurveyModel,
  ProgressButtons,
  ProgressButtonsResponsivityManager,
  IProgressButtonsViewModel,
} from "survey-core";
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";

const props = defineProps<{
  survey: SurveyModel;
  model: ProgressButtons;
  container: string;
}>();
const hasScroller = ref(false);
const canShowHeader = ref(false);
const canShowFooter = ref(false);
const canShowItemTitles = ref(true);
const progressButtonsListContainer = ref<HTMLElement>();
const css = computed(() => props.survey.css);
let respManager: ProgressButtonsResponsivityManager = null;

const clickScrollButton = (isLeftScroll: boolean) => {
  let element: any = progressButtonsListContainer.value;
  element.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
};

onMounted(() => {
  const element: any = progressButtonsListContainer.value;
  respManager = new ProgressButtonsResponsivityManager(props.model, element, {
    onResize: (canShowItemTitlesValue: boolean) => {
      canShowItemTitles.value = canShowItemTitlesValue;
      canShowHeader.value = !canShowItemTitlesValue;
    },
    onUpdateScroller: (hasScrollerValue: boolean) => {
      hasScroller.value = hasScrollerValue;
    },
    onUpdateSettings: () => {
      canShowItemTitles.value = props.model.showItemTitles;
      canShowFooter.value = !props.model.showItemTitles;
    },
    container: computed(() => props.container),
  } as any);
});
onBeforeUnmount(() => {
  respManager.dispose();
});
</script>
