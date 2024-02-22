<template>
  <div :class="row.getRowCss()" ref="root" :id="row.id">
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
import type { QuestionRowModel, SurveyElement, SurveyModel } from "survey-core";
import { Animation } from "survey-core";
import { computed, onMounted, ref, shallowRef, triggerRef, watch } from "vue";
import { useBase } from "./base";

const props = defineProps<{
  row: QuestionRowModel;
  css?: any;
  survey: SurveyModel;
}>();
const root = ref<HTMLElement>();

const elements = shallowRef();
function mergeArrays<T>(arr1: Array<T>, arr2: Array<T>) {
  const res: Array<T> = [];
  for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
    if (arr2[i]) {
      res.push(arr2[i]);
    }
    if (arr1[i] && res.indexOf(arr1[i]) < 0) {
      res.push(arr1[i]);
    }
  }
  return res;
}
watch(
  () => [].concat(props.row.visibleElements),
  (newValue, oldValue) => {
    if (oldValue) {
      const addedRows = newValue.filter((el) => oldValue.indexOf(el) < 0);
      const removedRows = oldValue.filter((el) => newValue.indexOf(el) < 0);
      // elements.value = mergeArrays(oldValue, newValue);
      // triggerRef(elements);
      addedRows.forEach((element) =>
        new Animation().onEnter(
          () =>
            document.querySelector(`[data-wrap=${element.id}]`) as HTMLElement,
          {
            classes: { onEnter: "elementFadeIn" },
            onBeforeRunAnimation: (el) => {
              el.style.setProperty("--animation-width", el.offsetWidth + "px");
            },
          }
        )
      );
      if (removedRows.length > 0) {
        let counter = removedRows.length;
        removedRows.forEach((element) => {
          new Animation().onLeave(
            () =>
              document.querySelector(
                `[data-wrap=${element.id}]`
              ) as HTMLElement,
            () => {
              if (--counter <= 0) {
                elements.value = newValue;
                triggerRef(elements);
              }
            },
            {
              classes: { onLeave: "elementFadeOut", onHide: "hidden" },
              onBeforeRunAnimation: (el) => {
                el.style.setProperty(
                  "--animation-width",
                  el.offsetWidth + "px"
                );
              },
            }
          );
        });
      } else {
        elements.value = newValue;
        triggerRef(elements);
      }
    } else {
      elements.value = newValue;
      triggerRef(elements);
    }
  },
  { immediate: true }
);

useBase(
  () => props.row,
  (newValue, oldValue) => {
    if (oldValue) {
      newValue.isNeedRender = oldValue.isNeedRender;
    }
  },
  (value) => {
    value.stopLazyRendering();
    value.isNeedRender = !value.isLazyRendering();
  }
);

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
