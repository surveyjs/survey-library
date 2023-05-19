import { Base, Question } from "survey-core";
import {
  ref,
  defineComponent,
  type ComponentOptions,
  unref,
  isRef,
  markRaw,
} from "vue";
Base.createPropertiesHash = () => {
  const res = {};
  markRaw(res);
  return res;
};
function makeReactive(surveyElement: Base) {
  surveyElement.iteratePropertiesHash((propertiesHash: any, name: any) => {
    // (<any>Vue.util).defineReactive(propertiesHash, name, propertiesHash[name]);
    propertiesHash[name] = ref(propertiesHash[name]);
  });
  surveyElement.getPropertyValueCoreHandler = (
    propertiesHash: any,
    name: string
  ) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!propertiesHash.hasOwnProperty(name)) {
      // (<any>Vue.util).defineReactive(propertiesHash, name, propertiesHash[name]);
      propertiesHash[name] = ref(propertiesHash[name]);
    }
    return unref(propertiesHash[name]);
  };
  surveyElement.setPropertyValueCoreHandler = (
    propertiesHash: any,
    name: string,
    val: any
  ) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!isRef(propertiesHash[name])) {
      propertiesHash[name] = ref(propertiesHash[name]);
    } else propertiesHash[name].value = val;
  };
}
// by convention, composable function names start with "use"

export const BaseVue: ComponentOptions = {
  mounted: function () {
    if (this.getModel == "function") {
      makeReactive(this.getModel());
    }
  },
};
export const QuestionVue: ComponentOptions = {
  mixins: [BaseVue],
  data(vm: any) {
    return {
      getModel: () => {
        return vm.question;
      },
    };
  },
  mounted() {
    if (this.question) {
      this.question.afterRenderQuestionElement(this.$el);
    }
  },
  beforeUnmount() {
    if (this.question) {
      this.question.beforeDestroyQuestionElement(this.$el);
    }
  },
};

export function defineSurveyComponent(componentDefinition: ComponentOptions) {
  const mounted = componentDefinition.mounted;
  componentDefinition.mounted = function () {
    if (typeof this.getModel === "function") {
      makeReactive(this.getModel());
    }
    if (mounted) {
      mounted.call(this);
    }
  };
  return defineComponent(componentDefinition);
}

export function getComponentName(question: Question): string {
  if (question.customWidget) return "survey-customwidget";
  if (
    (question.isDefaultRendering && question.isDefaultRendering()) ||
    question.isPanel
  )
    return "survey-" + question.getTemplate();
  return question.getComponentName();
}
