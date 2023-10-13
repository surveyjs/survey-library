import { computed } from "vue";
import { Action } from "survey-core";

export function useMatrixAction(
  props: { item: Action },
  withRow: boolean = true
) {
  return {
    question: computed(() => props.item.data.question),
    row: withRow ? computed(() => props.item.data.row) : (undefined as any),
  };
}
