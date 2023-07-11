import type { ComponentOptions, PropType } from "vue";
import { Action, QuestionPanelDynamicModel } from "survey-core";

export const PaneldynamicActionMixin: ComponentOptions = {
  props: {
    data: { type: Object as PropType<Object>, required: false },
    item: { type: Object as PropType<Action>, required: false },
  },
  computed: {
    // readonly
    question(): QuestionPanelDynamicModel {
      return (this.item && this.item.data.question) || this.data.question;
    },
  },
};
