<template>
  <div :class="question.getQuestionRootCss()" ref="root">
    <div v-if="question.showSearch" :class="question.cssClasses.searchRow">
      <div :class="question.searchRootCss">
        <SvComponent :is="'sv-svg-icon'" :className="question.cssClasses.searchIcon" :iconName="'icon-search-24x24'" :size="'auto'"></SvComponent>
        <input type="text" :class="question.searchCss.control" :value="question.searchString" :placeholder="question.searchPlaceholder"
          :aria-label="filterUIStrings.searchLabel" :disabled="question.isSearchDisabled"
          @input="onSearchInput" />
      </div>
      <SvComponent :is="'sv-action-bar'" :model="question.searchToolbar"></SvComponent>
    </div>
    <div :class="question.cssClasses.chipsRow">
      <div :class="question.chipsCss" ref="chipsRef">
        <SvComponent :is="'sv-action-bar'" :model="question.chipsToolbar"></SvComponent>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="question.clearToolbar"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
// The Filter Control (#11890), as packages/survey-react-ui/src/components/filter/filter.tsx draws it.
import { type QuestionFilterModel, filterUIStrings } from "survey-core";
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
