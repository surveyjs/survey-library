import type { ComponentOptions, PropType } from "vue";
import { QuestionBooleanModel } from "survey-core";

export const BooleanBaseMixin: ComponentOptions = {
  props: {
    question: Object as PropType<QuestionBooleanModel>,
  },
  methods: {
    onLabelClick(event: any, value: boolean) {
      this.question.onLabelClick(event, value);
    },
    onSwitchClick(event: any) {
      this.question.onSwitchClickModel(event);
    },
  },
};
