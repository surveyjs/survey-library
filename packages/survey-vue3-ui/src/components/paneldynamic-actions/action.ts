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
export function useIsActionEnabled(props: IPanelDynamicActionProps) {
  return computed<boolean>(
    () => !props.item || props.item.enabled !== false
  );
}
export function useIsAddActionEnabled(props: IPanelDynamicActionProps) {
  const question = usePanelDynamicAction(props);
  return computed<boolean>(
    () => props.item ? props.item.enabled !== false : question.value.enableAddPanel !== false
  );
}
