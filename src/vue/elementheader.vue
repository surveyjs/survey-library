 <template>
 <div :class="getHeaderClass(element)">
      <h5 v-if="element.hasTitle" :class="getTitleClass(element)">
          <span
            v-if="element.no"
            style="position: static;"
            :class="element.cssClasses.number"
          >{{element.no}}</span>
          <span v-if="element.no" style="position: static;">.&nbsp</span>
          <survey-string :locString="element.locTitle" />
      </h5>
      <div v-if="!element.locDescription.isEmpty" :class="element.cssClasses.description">
        <survey-string :locString="element.locDescription" />
      </div>
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { SurveyModel } from "../survey";
import { IElement, IQuestion } from "../base";
import { Question } from "../question";

@Component
export class ElementHeader extends Vue {
  @Prop element: IElement;

  getTitleClass(element: Question) {
    var cssClasses = element.cssClasses;
    var titleClass = cssClasses.title;

    if (!element.isPanel && !element.isEmpty()) {
      titleClass += " " + cssClasses.titleOnAnswer;
    }

    if (!element.isPanel && element.errors.length > 0) {
      titleClass += " " + cssClasses.titleOnError;
    }
    return titleClass;
  }
  getHeaderClass(element: Question) {
    var headerClass = element.cssClasses.header;
    if(element.hasTitleOnTop) {
        headerClass += " " + element.cssClasses.headerTop;
    }
    if (element.hasTitleOnLeft) {
      headerClass += " " + element.cssClasses.headerLeft;
    }
    if(element.hasTitleOnBottom) {
        headerClass += " " + element.cssClasses.headerBottom;
    }

    return headerClass;
  }
}
Vue.component("survey-element-header", ElementHeader);
export default ElementHeader;
</script>