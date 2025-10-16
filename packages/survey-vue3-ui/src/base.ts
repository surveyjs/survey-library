import {
  Base,
  Question,
  LocalizableString,
  type IPropertyArrayValueChangedEvent,
} from "survey-core";
import {
  ref,
  isRef,
  watch,
  unref,
  onMounted,
  type Ref,
  onBeforeUnmount,
  nextTick,
  customRef,
  onBeforeUpdate,
  onUpdated,
  onBeforeMount,
  triggerRef,
} from "vue";

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

function useCoreRef<T = any>(options: {
  initialValue: any;
  surveyElement: Base;
  isUpdateAllowed: () => boolean;
  nextRenderManager: NextRenderManager;
}): Ref<T> {
  let value = options.initialValue;
  return customRef<T>((tracker, trigger) => {
    const update = () => {
      if (options.isUpdateAllowed()) {
        trigger();
        options.nextRenderManager.add();
      }
    };
    return {
      get() {
        tracker();
        return value;
      },
      set(val) {
        const isChanged = value !== val;
        value = val;
        if (isChanged) {
          update();
        }
      },
    };
  });
}
export function makeReactive(surveyElement: Base) {
  if (!surveyElement) return;
  (surveyElement as any).__vueUpdatesLock =
    (surveyElement as any).__vueUpdatesLock ?? 0;
  (surveyElement as any).__vueImplemented =
    (surveyElement as any).__vueImplemented ?? 0;
  if ((surveyElement as any).__vueImplemented <= 0) {
    const isUpdateAllowed = () => (surveyElement as any).__vueUpdatesLock <= 0;
    const nextRenderManager = new NextRenderManager(surveyElement);
    const onArrayChanged = (_: Base, options: IPropertyArrayValueChangedEvent) => {
      const arrRef = options.valueFromHash;
      if (isUpdateAllowed() && isRef(arrRef)) {
        triggerRef(arrRef);
        nextRenderManager.add();
      }
    };
    const setRef = (hash: any, key: string, initVal?: any): void => {
      hash[key] = useCoreRef({
        initialValue: initVal ?? hash[key],
        surveyElement,
        isUpdateAllowed,
        nextRenderManager
      });
    };
    surveyElement.addOnArrayChangedCallback(onArrayChanged);
    surveyElement.createArrayCoreHandler = (hash, key: string): Array<any> => {
      setRef(hash, key, []);
      return unref(hash[key]);
    };
    surveyElement.iteratePropertiesHash((hash, key) => {
      setRef(hash, key);
    });
    surveyElement.getPropertyValueCoreHandler = (hash, key) => {
      if (!isRef(hash[key])) {
        setRef(hash, key);
      }
      return unref(hash[key]);
    };
     surveyElement.setPropertyValueCoreHandler = (hash, key, val) => {
      if (isRef(hash[key])) {
        hash[key].value = val;
      } else {
        setRef(hash, key, val);
      }
      nextRenderManager.add();
    };
    (surveyElement as any).__vueClear = () => {
      surveyElement.iteratePropertiesHash((hash, key) => {
        hash[key] = unref(hash[key]);
      });
      delete (surveyElement as any).__vueClear;
      delete (surveyElement as any).__vueUpdatesLock;
      delete (surveyElement as any).__vueImplemented;
      surveyElement.removeOnArrayChangedCallback(onArrayChanged);
      surveyElement.createArrayCoreHandler = undefined as any;
      surveyElement.getPropertyValueCoreHandler = undefined as any;
      surveyElement.setPropertyValueCoreHandler = undefined as any;
      surveyElement.disableOnElementRerenderedEvent();
    };
    surveyElement.enableOnElementRerenderedEvent();
  }
  (surveyElement as any).__vueImplemented++;
}

export function isBaseElementSubsribed(surveyElement: Base) {
  return !!(surveyElement as any).__vueImplemented;
}

export function unMakeReactive(surveyElement?: Base) {
  if (!surveyElement) return;
  (surveyElement as any).__vueImplemented =
    (surveyElement as any).__vueImplemented ?? 0;
  (surveyElement as any).__vueImplemented--;
  if ((surveyElement as any).__vueImplemented <= 0) {
    if (typeof (surveyElement as any).__vueClear == "function") {
      (surveyElement as any).__vueClear();
    }
  }
}

function blockUpdates(model: any) {
  if (model && model.__vueUpdatesLock !== undefined) {
    model.__vueUpdatesLock++;
  }
}
function releaseUpdates(model: any) {
  if (model && model.__vueUpdatesLock !== undefined) {
    model.__vueUpdatesLock--;
  }
}

// by convention, composable function names start with "use"
export function useBase<T extends Base>(
  getModel: () => T,
  onModelChanged?: (newValue: T, oldValue?: T) => void,
  clean?: (model: T) => void
) {
  let currentModel: T;
  const stopWatch = watch(
    getModel,
    (value, oldValue) => {
      if (value && onModelChanged) onModelChanged(value, oldValue);
      if (oldValue) {
        unMakeReactive(oldValue);
        if (clean) clean(oldValue);
      }
      currentModel = value;
      makeReactive(value);
    },
    {
      immediate: true,
    }
  );
  let isOnBeforeUnmountCalled = false;

  onBeforeUpdate(() => {
    blockUpdates(currentModel);
  });
  onUpdated(() => {
    releaseUpdates(currentModel);
  });
  onBeforeMount(() => blockUpdates(currentModel));
  onMounted(() => releaseUpdates(currentModel));
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
