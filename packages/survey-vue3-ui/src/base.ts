import { Base, Question, LocalizableString, IOnArrayChangedEvent } from "survey-core";
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

interface CoreRef<T = any>  {
  ref: Ref<T>,
  clear?: () => void;
}

function isCoreRef(coreRef: any) {
  return typeof coreRef == "object" && isRef(coreRef.ref);
}
function unCoreRef(val: any) {
  if(isCoreRef(val)) {
    return unref(val.ref);
  } else {
    return val;
  }
}

function useCoreRef(options: {
  initialValue: any;
  surveyElement: Base,
  isUpdateAllowed: () => boolean;
  nextRenderManager: NextRenderManager;
  isArray?: boolean
}): CoreRef {
  let value = options.initialValue;
  let clear!: () => void;
  return { ref: customRef((tracker, trigger) => {
    const update = () => {
      if (options.isUpdateAllowed()) {
        trigger();
        options.nextRenderManager.add();
      }
    }
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
    };}), clear };
}
function onArrayChanged(surveyElement: Base, options: IOnArrayChangedEvent): void {
  const isUpdateAllowed = () => (surveyElement as any).__vueUpdatesLock <= 0;
  if (isUpdateAllowed()) {
    options.name
  }
}
export function makeReactive(
  surveyElement: Base) {
  if (!surveyElement) return;
  (surveyElement as any).__vueUpdatesLock = (surveyElement as any).__vueUpdatesLock ?? 0;
  (surveyElement as any).__vueImplemented = (surveyElement as any).__vueImplemented ?? 0;
  if ((surveyElement as any).__vueImplemented <= 0) {
    const isUpdateAllowed = () => (surveyElement as any).__vueUpdatesLock <= 0;
    const nextRenderManager = new NextRenderManager(surveyElement);
    surveyElement.createArrayCoreHandler = (hash, key: string): Array<any> => {
      hash[key] = useCoreRef({
        initialValue: [],
        surveyElement,
        isUpdateAllowed,
        nextRenderManager,
        isArray: true
      });
      return unCoreRef(hash[key]);
    };
    surveyElement.iteratePropertiesHash((hash, key) => {
      hash[key] = useCoreRef({
        initialValue: hash[key],
        surveyElement,
        isUpdateAllowed,
        nextRenderManager,
        isArray: Array.isArray(hash[key])
      });
    });
    surveyElement.addOnArrayChangedCallback(onArrayChanged)
    surveyElement.getPropertyValueCoreHandler = (hash, key) => {
      if (!isCoreRef(hash[key])) {
        hash[key] = useCoreRef({
          initialValue: hash[key],
          surveyElement,
          isUpdateAllowed,
          nextRenderManager,
        });
      }
      return unCoreRef(hash[key]);
    };
    surveyElement.setPropertyValueCoreHandler = (hash, key, val) => {
      if (isCoreRef(hash[key])) {
        hash[key].ref.value = val;
      } else {
        hash[key] = useCoreRef({
          initialValue: hash[key],
          surveyElement,
          isUpdateAllowed,
          nextRenderManager,
        });
      }
      nextRenderManager.add();
    };
  }
  surveyElement.enableOnElementRerenderedEvent();
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
    surveyElement.iteratePropertiesHash((hash, key) => {
      if (isCoreRef(hash[key]) && typeof hash[key].clear == "function") {
        hash[key].clear();
      }
      hash[key] = unCoreRef(hash[key]);
    });
    delete (surveyElement as any).__vueUpdatesLock;
    delete (surveyElement as any).__vueImplemented;
    surveyElement.removeOnArrayChangedCallback(onArrayChanged);
    surveyElement.createArrayCoreHandler = undefined as any;
    surveyElement.getPropertyValueCoreHandler = undefined as any;
    surveyElement.setPropertyValueCoreHandler = undefined as any;
    surveyElement.disableOnElementRerenderedEvent();
  }
}

function blockUpdates(model: any) {
    if(model && model.__vueUpdatesLock !== undefined) {
      model.__vueUpdatesLock++;
    }
}
function releaseUpdates(model: any) {
    if(model && model.__vueUpdatesLock !== undefined) {
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
  }) 
  onUpdated(() => {
    releaseUpdates(currentModel);
  });
  onBeforeMount(() => blockUpdates(currentModel))
  onMounted(() => releaseUpdates(currentModel))
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