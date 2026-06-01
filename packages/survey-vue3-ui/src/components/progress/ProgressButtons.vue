<template>
  <div
    :class="model.getRootCss(container)"
    :style="{ maxWidth: model.progressWidth }"
    role="tablist"
    :aria-label="model.progressBarAriaLabel"
    @keydown="model.onKeyDown($event)"
  >
    <div v-if="canShowHeader" :class="css.progressButtonsHeader">
      <div :class="css.progressButtonsPageTitle" :title="model.headerText">{{ model.headerText }}</div>
    </div>
    <div :class="css.progressButtonsContainer" role="presentation">
      <div
        :class="css.progressButtonsListContainer"
        ref="progressButtonsListContainer"
        role="presentation"
      >
        <ul :class="css.progressButtonsList" role="presentation">
          <li
            v-for="(page, index) in model.visiblePages"
            :key="'listelement' + page.uniqueId"
            :class="model.getListElementCss(index)"
            :data-page-number="model.getItemNumber(page)"
            role="presentation"
          >
            <div
              v-if="model.showItemTitles"
              :class="css.progressButtonsPageTitle"
              :title="page.renderedNavigationTitle"
              @click="model.isListElementClickable(index) ? model.clickListElement(page) : null"
            >
              <SvComponent
                :is="'survey-string'"
                :locString="page.locNavigationTitle"
              />
            </div>
            <div
              v-if="model.showItemDescriptions"
              :class="css.progressButtonsPageDescription"
              :title="page.navigationDescription"
              @click="model.isListElementClickable(index) ? model.clickListElement(page) : null"
            >
              {{ page.navigationDescription }}
            </div>
            <button
              :class="css.progressButtonsButton"
              @click="model.isListElementClickable(index) ? model.clickListElement(page) : undefined"
              role="tab"
              :aria-selected="model.isPageSelected(index)"
              :aria-label="model.getButtonAriaLabel(page)"
              :tabindex="model.getTabIndex(index)"
              :data-page-index="index"
            >
              <template v-if="model.showItemNumbers">{{ model.getItemNumber(page) }}</template>
              <template v-else-if="model.isListElementPassed(index)">
                <svg :class="css.progressButtonsCheckIcon">
                  <use :xlink:href="'#icon-' + css.progressButtonsCheckIconId"></use>
                </svg>
              </template>
              <template v-else>
                <div :class="css.progressButtonsDot"></div>
              </template>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="canShowFooter" :class="css.progressButtonsFooter">
      <div :class="css.progressButtonsPageTitle" :title="model.footerText">{{ model.footerText }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import SvComponent from "@/SvComponent.vue";
import {
  type SurveyModel,
  ProgressButtons,
  ProgressButtonsResponsivityManager,
} from "survey-core";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";


const props = defineProps<{
  survey: SurveyModel;
  model: ProgressButtons;
  container: string;
}>();
useBase(() => props.model);
const canShowItemTitles = ref(true);
const canShowHeader = ref(false);
const canShowFooter = ref(false);
const progressButtonsListContainer = ref<HTMLElement>();
const css = computed(() => props.survey.css);
let respManager: ProgressButtonsResponsivityManager = null as any;

onMounted(() => {
  const element: any = progressButtonsListContainer.value;
  respManager = new ProgressButtonsResponsivityManager(props.model, element, {
    onResize: (canShowItemTitlesValue: boolean) => {
      canShowItemTitles.value = canShowItemTitlesValue;
    },
    onUpdateScroller: (_hasScrollerValue: boolean) => {
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
