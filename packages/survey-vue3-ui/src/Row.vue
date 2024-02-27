<template>
  <div :class="rowCss" ref="root" :id="row.id">
    <survey-element
      :row="row"
      :css="css"
      :element="element"
      v-for="element in elements"
      :key="element.id"
    ></survey-element>
  </div>
</template>

<script lang="ts" setup>
import {
  AnimationCollection,
  type IElement,
  type QuestionRowModel,
  type SurveyElement,
  type SurveyModel,
} from "survey-core";
import {
  computed,
  onMounted,
  onUnmounted,
  onUpdated,
  ref,
  shallowRef,
  toRaw,
  triggerRef,
} from "vue";
import { useBase } from "./base";

const props = defineProps<{
  row: QuestionRowModel;
  css?: any;
  survey: SurveyModel;
}>();
const root = ref<HTMLElement>();

const value = props.row.visibleElements;

const rowCss = computed(() => {
  return props.row.getRowCss();
});

const elements = shallowRef();
elements.value = toRaw(props.row.visibleElements);

onUpdated(() => {
  debugger;
});

let animationCollection: AnimationCollection<IElement>;
useBase(
  () => props.row,
  (newValue, oldValue) => {
    if (oldValue) {
      newValue.isNeedRender = oldValue.isNeedRender;
    }
    if (animationCollection) {
      animationCollection.dispose();
    }
    animationCollection = new AnimationCollection(
      newValue,
      "visibleElements",
      {
        getElement: (element: IElement) =>
          document.querySelector(`[data-wrap=${element.id}]`) as HTMLElement,
        onLeave: { classes: { onLeave: "elementFadeOut", onHide: "hidden" } },
        onEnter: {
          classes: { onEnter: "elementFadeIn" },
          onBeforeRunAnimation: (el) => {
            el.style.setProperty("--animation-height", el.offsetHeight + "px");
            el.style.setProperty("--animation-width", el.offsetWidth + "px");
          },
        },
      },
      (updatedElements: Array<IElement>) => {
        elements.value = updatedElements;
        triggerRef(elements);
      }
    );
  },
  (value) => {
    value.stopLazyRendering();
    value.isNeedRender = !value.isLazyRendering();
  }
);

onUnmounted(() => {
  if (animationCollection) {
    animationCollection.dispose();
  }
});

onMounted(() => {
  if (props.row) {
    if (!props.row.isNeedRender) {
      const rowContainerDiv = root.value;
      setTimeout(() => {
        props.row.startLazyRendering(rowContainerDiv as HTMLElement);
      }, 10);
    }
  }
});
</script>
