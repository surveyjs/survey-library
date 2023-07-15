import { computed } from "vue";
import type { Action, QuestionPanelDynamicModel } from "survey-core";

export type IPanelDynamicActionProps =
  | { item: Action; data?: any }
  | { item?: Action; data: any };
export function usePanelDynamicAction(props: IPanelDynamicActionProps) {
  return computed<QuestionPanelDynamicModel>(
    () => (props.item && props.item.data.question) || props.data.question
  );
}
