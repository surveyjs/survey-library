import type { ComponentOptions, PropType } from "vue";
import { QuestionBooleanModel } from "survey-core";

export const BooleanBaseMixin: ComponentOptions = {
  props: {
    question: Object as PropType<QuestionBooleanModel>,
  },
  data(vm: any) {
    return {
      onLabelClick: (event: any, value: boolean) => {
        vm.question.onLabelClick(event, value);
      },
      onSwitchClick: (event: any) => {
        vm.question.onSwitchClickModel(event);
      },
    };
  },
};
