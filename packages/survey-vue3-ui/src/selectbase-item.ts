import type { ItemValue, QuestionSelectBase } from "survey-core";
import { onMounted, type Ref } from "vue";
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
  useBase(
    getItem,
    (newValue, oldValue) => {
      if (!getQuestion().isDesignMode) {
        if (newValue && root.value) {
          newValue.setRootElement(root.value);
        }
        if (oldValue) {
          oldValue.setRootElement(undefined as any);
        }
      }
    },
    () => {
      const item = getItem();
      const question = getQuestion();
      if (question && item && question.isDesignMode) {
        item.setRootElement(undefined as any);
      }
    }
  );
}
