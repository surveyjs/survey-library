import type { ItemValue, QuestionSelectBase } from "survey-core";
import { onMounted, onUnmounted, type Ref } from "vue";
import { useBase } from "./base";

export function useSelectBaseItem(
  getItem: () => ItemValue,
  getQuestion: () => QuestionSelectBase,
  root: Ref<HTMLElement | undefined>
) {
  onMounted(() => {
    if (root.value) {
      if (!getQuestion().isDesignMode) {
        getItem().setRootElement(root.value);
      }
    }
  });
  onUnmounted(() => {
    if (!getQuestion().isDesignMode) {
      getItem().setRootElement(undefined as any);
    }
  });
  useBase(getItem, (newValue, oldValue) => {
    if (!getQuestion().isDesignMode) {
      if (newValue && root.value) {
        newValue.setRootElement(root.value);
      }
      if (oldValue) {
        oldValue.setRootElement(undefined as any);
      }
    }
  });
}
