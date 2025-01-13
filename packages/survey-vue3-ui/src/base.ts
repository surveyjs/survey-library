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
  nextTick,
  onUnmounted,
} from "vue";
Base.createPropertiesHash = () => {
  const res = shallowReactive({});
  return res;
};

class NextRenderManager {
  constructor(private element: Base) {}
  private currentNextTickPromise?: Promise<void>;
  async add() {
    const nextTickPromise = nextTick();
    if (this.currentNextTickPromise !== nextTickPromise) {
      this.currentNextTickPromise = nextTickPromise;
      await nextTickPromise;
      if (nextTickPromise == this.currentNextTickPromise) {
        this.element.afterRerender();
      }
    }
  }
}

export function makeReactive(surveyElement: Base) {
  if (!surveyElement) return;
  (surveyElement as any).__vueImplemented =
    (surveyElement as any).__vueImplemented ?? 0;
  if ((surveyElement as any).__vueImplemented <= 0) {
    const nextRenderManager = new NextRenderManager(surveyElement);
    surveyElement.createArrayCoreHandler = (hash, key: string): Array<any> => {
      const arr: any = [];
      const arrayRef = shallowRef(arr);

      arr.onArrayChanged = () => {
        triggerRef(arrayRef);
        nextRenderManager.add();
      };
      hash[key] = arrayRef;
      return unref(hash[key]);
    };
    surveyElement.iteratePropertiesHash((hash, key) => {
      if (Array.isArray(hash[key])) {
        const arrayRef = shallowRef(hash[key]);
        hash[key]["onArrayChanged"] = () => {
          triggerRef(arrayRef);
          nextRenderManager.add();
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
      nextRenderManager.add();
    };
  }
  surveyElement.enableOnElementRerenderedEvent();
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
    surveyElement.disableOnElementRerenderedEvent();
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
  let isOnBeforeUnmountCalled = false;
  onBeforeUnmount(() => {
    if (!isOnBeforeUnmountCalled) {
      const model = getModel();
      if (model) {
        unMakeReactive(model);
        stopWatch();
        if (clean) clean(model);
      }
      isOnBeforeUnmountCalled = true;
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
  const onStringChangedCallbck = (locString: LocalizableString) => {
    renderedHtml.value = locString.renderedHtml;
  };
  const setupOnChangedCallback = (locString: LocalizableString) => {
    renderedHtml.value = locString.renderedHtml;
    locString.onStringChanged.add(onStringChangedCallbck);
  };
  const stopWatch = watch(
    getLocString,
    (newValue, oldValue) => {
      if (oldValue) oldValue.onStringChanged.remove(onStringChangedCallbck);
      setupOnChangedCallback(newValue);
    },
    { immediate: true }
  );
  onBeforeUnmount(() => {
    const locString = getLocString();
    if (locString) {
      locString.onStringChanged.remove(onStringChangedCallbck);
    }
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
