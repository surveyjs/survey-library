import { Base, Question, LocalizableString } from "survey-core";
import {
  type ComponentOptions,
  shallowReactive,
  ref,
  isRef,
  watch,
  onUnmounted,
  shallowRef,
  triggerRef,
  unref,
  onMounted,
  type Ref,
  onBeforeUnmount,
} from "vue";
Base.createPropertiesHash = () => {
  const res = shallowReactive({});
  // markRaw(res);
  return res;
};
function makeReactive(surveyElement: Base) {
  if (!surveyElement) return;
  surveyElement.createArrayCoreHandler = (hash, key: string): Array<any> => {
    const arrayRef = shallowRef(hash[key]);
    hash[key]["onArrayChanged"] = () => {
      triggerRef(arrayRef);
    };
    hash[key] = arrayRef;
    return unref(hash[key]);
  };
  surveyElement.iteratePropertiesHash((hash, key) => {
    if (Array.isArray(hash[key])) {
      const arrayRef = shallowRef(hash[key]);
      hash[key]["onArrayChanged"] = () => {
        triggerRef(arrayRef);
      };
      hash[key] = arrayRef;
    }
  });
  surveyElement.getPropertyValueCoreHandler = (hash, key) => {
    return unref(hash[key]);
  };
  surveyElement.setPropertyValueCoreHandler = (hash, key, val) => {
    if (isRef(hash[key])) {
      hash[key].value = val;
    } else {
      hash[key] = val;
    }
  };
}

function unMakeReactive(surveyElement: Base) {
  if (!surveyElement) return;
  surveyElement.iteratePropertiesHash((hash, key) => {
    hash[key] = unref(hash[key]);
    if (Array.isArray(hash[key])) {
      hash[key]["onArrayChanged"] = undefined;
    }
  });
  surveyElement.createArrayCoreHandler = undefined as any;
  surveyElement.getPropertyValueCoreHandler = undefined as any;
  surveyElement.setPropertyValueCoreHandler = undefined as any;
}

// by convention, composable function names start with "use"

export const BaseVue: ComponentOptions = {
  mounted() {
    if (typeof this.getModel == "function") {
      const stopWatch = watch(
        () => this.getModel(),
        (value, oldValue) => {
          unMakeReactive(oldValue);
          makeReactive(value);
        },
        {
          immediate: true,
        }
      );
      onUnmounted(() => {
        unMakeReactive(this.getModel());
        stopWatch();
      });
    }
  },
};
export function useBase<T extends Base>(
  getModel: () => T,
  onModelChanged?: (newValue: T) => void,
  clean?: (model: T) => void
) {
  const stopWatch = watch(
    getModel,
    (value, oldValue) => {
      if (onModelChanged) onModelChanged(value);
      if (clean && oldValue) clean(oldValue);
      makeReactive(value);
    },
    {
      immediate: true,
    }
  );
  onUnmounted(() => {
    if (clean) clean(getModel());
    stopWatch();
  });
}

export function useQuestion<T extends Question>(
  props: { question: T },
  root: Ref,
  onQuestionChanged?: (newValue: T) => void,
  clean?: (question: T) => void
) {
  useBase<T>(() => props.question, onQuestionChanged, clean);
  onMounted(() => {
    if (props.question) {
      props.question.afterRenderQuestionElement(root.value);
    }
  });
  onBeforeUnmount(() => {
    props.question.beforeDestroyQuestionElement(root.value);
  });
}

export function useLocString(
  getLocString: () => LocalizableString
): Ref<string> {
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
