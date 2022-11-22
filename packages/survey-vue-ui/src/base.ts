import type { Question } from "survey-core";
import { ref, onBeforeMount } from "vue";

// by convention, composable function names start with "use"
export function makeReactive(question: Question): void {
  onBeforeMount(() => {
    question.iteratePropertiesHash((propertiesHash: any, name: any) => {
      // (<any>Vue.util).defineReactive(propertiesHash, name, propertiesHash[name]);
      propertiesHash[name] = ref(propertiesHash[name]);
    });
    question.getPropertyValueCoreHandler = (
      propertiesHash: any,
      name: string
    ) => {
      if (!propertiesHash.hasOwnProperty(name)) {
        // (<any>Vue.util).defineReactive(propertiesHash, name, propertiesHash[name]);
        propertiesHash[name] = ref(propertiesHash[name]);
      }
      return propertiesHash[name].value;
    };
    question.setPropertyValueCoreHandler = (
      propertiesHash: any,
      name: string,
      val: any
    ) => {
      if (!propertiesHash.hasOwnProperty(name)) {
        propertiesHash[name] = ref(propertiesHash[name]);
      } else propertiesHash[name].value = val;
    };
  });
}
