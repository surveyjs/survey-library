<template>
  <div :class="getRootCss()" ref="root">
    <div v-if="question.showSearch" :class="question.cssClasses.searchRow">
      <div :class="getSearchRootCss()">
        <SvComponent :is="'sv-svg-icon'" :className="question.cssClasses.searchIcon" :iconName="'icon-search-24x24'" :size="'auto'"></SvComponent>
        <input type="text" :class="question.searchCss.control" :value="question.searchString" :placeholder="question.searchPlaceholder"
          :aria-label="filterUIStrings.searchLabel" :disabled="question.isDesignMode"
          @input="onSearchInput" />
      </div>
      <SvComponent :is="'sv-action-bar'" :model="question.searchToolbar"></SvComponent>
    </div>
    <div :class="question.cssClasses.chipsRow">
      <div :class="getChipsCss()" ref="chipsRef">
        <SvComponent :is="'sv-action-bar'" :model="question.chipsToolbar"></SvComponent>
      </div>
      <SvComponent :is="'sv-action-bar'" :model="question.clearToolbar"></SvComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
// The Filter Control (#11890), as packages/survey-react-ui/src/components/filter/filter.tsx draws it.
import { type QuestionFilterModel, filterUIStrings, toCssClasses } from "survey-core";
import SvComponent from "@/SvComponent.vue";
import { useBase, useQuestion } from "./base";
import { onBeforeUnmount, onMounted, onUpdated, ref, watch } from "vue";
defineOptions({ inheritAttrs: false });
const props = defineProps<{ question: QuestionFilterModel }>();
const root = ref(null);
const chipsRef = ref<HTMLElement>();
useQuestion(props, root);
// A disposed question has released its layout, and asking for it would build a new one.
useBase(() => props.question.isDisposed ? undefined as any : props.question.chipsLayout);

// Plain functions, not computed: the question builds its classes and toolbars on first use, which a
// computed would take for a change of its own dependency.
const getRootCss = (): string => toCssClasses(props.question.cssClasses.root, props.question.isMobile && props.question.cssClasses.rootMobile);
const getSearchRootCss = (): string => toCssClasses(props.question.searchCss.root, props.question.cssClasses.search);
const getChipsCss = (): string => toCssClasses(props.question.cssClasses.chips,
  !props.question.isDisposed && props.question.chipsLayout.isExpanded && props.question.cssClasses.chipsExpanded);

const onSearchInput = (event: any) => {
  const question = props.question;
  question.searchString = event.target.value;
};

// The chips row is measured once it is drawn: FilterChipsLayout cuts it to one row. The chips are
// drawn by the action bar, so a change of the chips is watched here too.
const updateLayout = () => {
  const q = props.question;
  if (!chipsRef.value || !q || q.isDisposed) return;
  q.chipsLayout.attach(chipsRef.value);
  q.chipsLayout.update();
};
onMounted(updateLayout);
onUpdated(updateLayout);
watch(() => props.question.isDisposed ? undefined : props.question.chipsToolbar.renderedActions, updateLayout, { flush: "post" });
onBeforeUnmount(() => {
  if (!!props.question && !props.question.isDisposed) {
    props.question.chipsLayout.detach();
  }
});
</script>
