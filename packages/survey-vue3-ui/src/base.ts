import { Base, Question, LocalizableString } from "survey-core";
import {
  shallowReactive,
  ref,
  isRef,
  watch,
  shallowRef,
  triggerRef,
  unref,
  onMounted,
  type Ref,
  onBeforeUnmount,
  watchEffect,
} from "vue";
Base.createPropertiesHash = () => {
  const res = shallowReactive({});
  return res;
};
export function makeReactive(surveyElement: Base) {
  if (!surveyElement) return;
  (surveyElement as any).__vueImplemented =
    (surveyElement as any).__vueImplemented ?? 0;
  if ((surveyElement as any).__vueImplemented <= 0) {
    surveyElement.createArrayCoreHandler = (hash, key: string): Array<any> => {
      const arr: any = [];
      const arrayRef = shallowRef(arr);

      arr.onArrayChanged = () => {
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
  (surveyElement as any).__vueImplemented++;
}

export function unMakeReactive(surveyElement?: Base) {
  if (!surveyElement) return;
  (surveyElement as any).__vueImplemented =
    (surveyElement as any).__vueImplemented ?? 0;
  (surveyElement as any).__vueImplemented--;
  if ((surveyElement as any).__vueImplemented <= 0) {
    surveyElement.iteratePropertiesHash((hash, key) => {
      hash[key] = unref(hash[key]);
      if (Array.isArray(hash[key])) {
        hash[key]["onArrayChanged"] = undefined;
      }
    });
    delete (surveyElement as any).__vueImplemented;
    surveyElement.createArrayCoreHandler = undefined as any;
    surveyElement.getPropertyValueCoreHandler = undefined as any;
    surveyElement.setPropertyValueCoreHandler = undefined as any;
  }
}

// by convention, composable function names start with "use"
export function useBase<T extends Base>(
  getModel: () => T,
  onModelChanged?: (newValue: T, oldValue?: T) => void,
  clean?: (model: T) => void
) {
  const stopWatch = watch(
    getModel,
    (value, oldValue) => {
      if (value && onModelChanged) onModelChanged(value, oldValue);
      if (oldValue) {
        unMakeReactive(oldValue);
        if (clean) clean(oldValue);
      }

      makeReactive(value);
    },
    {
      immediate: true,
    }
  );
  onBeforeUnmount(() => {
    const model = getModel();
    if (model) {
      unMakeReactive(model);
      if (clean) clean(model);
      stopWatch();
    }
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
  onBeforeUnmount(() => {
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

export function useComputedArray<T>(func: () => Array<T>) {
  const ref = shallowRef();

  const stopWatch = watchEffect(() => {
    ref.value = func();
    triggerRef(ref);
  });

  onBeforeUnmount(() => {
    stopWatch();
  });

  return ref;
}
