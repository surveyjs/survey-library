import { Base, Question } from "survey-core";
import {
  defineComponent,
  type ComponentOptions,
  shallowReactive,
  ref,
  isRef,
  isReactive,
  watch,
  watchEffect,
  onUnmounted,
  type Ref,
} from "vue";
Base.createPropertiesHash = () => {
  const res = shallowReactive({});
  // markRaw(res);
  return res;
};
function makeReactive(surveyElement: Base) {
  surveyElement.createArrayCoreHandler = (hash, key: string): Array<any> => {
    const arrayRef = shallowReactive(hash[key]);
    hash[key] = arrayRef;
    return hash[key];
  };
  surveyElement.iteratePropertiesHash((hash, key) => {
    if (Array.isArray(hash[key])) {
      const arrayRef = shallowReactive(hash[key]);
      hash[key] = arrayRef;
      return hash[key];
    }
  });
}
// by convention, composable function names start with "use"

export const BaseVue: ComponentOptions = {
  mounted() {
    if (typeof this.getModel == "function") {
      const stopWatch = watch(
        () => this.getModel(),
        (value) => {
          makeReactive(value);
        },
        {
          immediate: true,
        }
      );
      onUnmounted(() => {
        stopWatch();
      });
    }
  },
};
export const QuestionVue: ComponentOptions = {
  mixins: [BaseVue],
  methods: {
    getModel() {
      return this.question;
    },
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


export function useLocString(getLocString: () => LocalizableString ): Ref<string> {
  const renderedHtml = ref();
  const setupOnChangedCallback = (locString: LocalizableString) => {
    renderedHtml.value = locString.renderedHtml;
    locString.onChanged = () => {
      renderedHtml.value = locString.renderedHtml;
    };
  };
  const stopWatch = watch(
    getLocString,
    (newValue, oldValue) => {
      if (oldValue) oldValue.onChanged = () => {};
      setupOnChangedCallback(newValue);
    },
    { immediate: true }
  );
  onUnmounted(() => {
    stopWatch();
  });
  return renderedHtml;
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
