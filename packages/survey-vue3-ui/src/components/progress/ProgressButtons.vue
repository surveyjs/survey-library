<template>
  <div
    :class="model.getRootCss(container)"
    :style="{ maxWidth: model.progressWidth }"
    role="tablist"
    :aria-label="model.progressBarAriaLabel"
    @keydown="model.onKeyDown($event)"
  >
    <div :class="css.progressButtonsContainer" role="presentation">
      <div
        :class="css.progressButtonsListContainer"
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
  </div>
</template>

<script lang="ts" setup>
import { useBase } from "@/base";
import SvComponent from "@/SvComponent.vue";
import {
  type SurveyModel,
  ProgressButtons,
} from "survey-core";
import { computed } from "vue";


const props = defineProps<{
  survey: SurveyModel;
  model: ProgressButtons;
  container: string;
}>();
useBase(() => props.model);
const css = computed(() => props.survey.css);
</script>
