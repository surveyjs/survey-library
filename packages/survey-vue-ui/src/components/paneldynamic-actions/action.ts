import type { ComponentOptions } from "vue";
import { Action, QuestionPanelDynamicModel } from "survey-core";

export const PaneldynamicActionMixin: ComponentOptions = {
  props: {
    data: Object,
    item: Action,
  },
  computed: {
    // readonly
    question(vm: any): QuestionPanelDynamicModel {
      return (vm.item && vm.item.data.question) || vm.data.question;
    },
  },
};
