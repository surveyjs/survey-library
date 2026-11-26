<template>
  <div :class="question.getQuestionRootCss()" ref="root">
    <div v-if="question.showSearchBar" :class="question.cssClasses.searchRow">
      <div :class="question.searchRootCss">
        <SvComponent :is="'sv-svg-icon'" :className="question.cssClasses.searchIcon" :iconName="'icon-search-24x24'" :size="'auto'"></SvComponent>
        <input type="text" autocomplete="off" :class="question.searchCss.control" :value="question.searchString" :placeholder="question.searchPlaceholder"
          :aria-label="question.searchLabel" :disabled="question.isSearchDisabled"
          @input="onSearchInput" />
        <SvComponent v-if="question.showSearchClear" :is="'sv-action-bar-item'" :item="question.searchClearAction"></SvComponent>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="question.searchToolbar"></SvComponent>
    </div>
    <div :class="question.cssClasses.chipsRow">
      <div :class="question.chipsCss" ref="chipsRef">
        <SvComponent :is="'sv-action-bar'" :model="question.chipsToolbar"></SvComponent>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="question.clearToolbar"></SvComponent>
    </div>
    <div :class="question.cssClasses.popups">
      <SvComponent v-for="chip in question.popupChips" :key="chip.id" :is="'sv-popup'" :model="chip.popupModel"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
// The Filter Control (#11890), as packages/survey-react-ui/src/components/filter/filter.tsx draws it.
// The chips' popups are drawn outside the chips row: on a phone the row scrolls sideways, and iOS
// Safari keeps a fixed popup inside such a row.
import { type QuestionFilterModel } from "survey-core";
import SvComponent from "@/SvComponent.vue";
import { useBase, useQuestion } from "./base";
import { onBeforeUnmount, onMounted, ref } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionFilterModel }>();
const root = ref(null);
const chipsRef = ref<HTMLElement>();
useQuestion(props, root);
// A disposed question has released its layout, and asking for it would build a new one.
useBase(() => props.question.isDisposed ? undefined as any : props.question.chipsLayout);

const onSearchInput = (event: any) => {
  const question = props.question;
  question.searchString = event.target.value;
};

// FilterChipsLayout cuts the chips row to one row, and measures the row again itself whenever it
// changes: the renderer only attaches it and detaches it.
onMounted(() => {
  const q = props.question;
  if (!chipsRef.value || !q || q.isDisposed) return;
  q.chipsLayout.attach(chipsRef.value);
});
onBeforeUnmount(() => {
  if (!!props.question && !props.question.isDisposed) {
    props.question.chipsLayout.detach();
  }
});
</script>
