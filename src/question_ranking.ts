import SortableLib from "sortablejs";
import { Serializer } from "./jsonobject";
import { QuestionFactory } from "./questionfactory";
import { QuestionCheckboxModel } from "./question_checkbox";

const Sortable = <any>SortableLib;

/**
 * A Model for a ranking question
 */
export class QuestionRankingModel extends QuestionCheckboxModel {
  domNode: HTMLElement = null;
  sortableInst: any = null;

  public getType(): string {
    return "ranking";
  }

  //cross framework initialization
  public afterRenderQuestionElement(el: any) {
    if (!!el) {
      this.initSortable(el);
    }
    super.afterRenderQuestionElement(el);
  }
  //cross framework destroy
  public beforeDestroyQuestionElement(el: any) {
    if (this.sortableInst) this.sortableInst.destroy();
    super.beforeDestroyQuestionElement(el);
  }

  public initSortable(domNode: HTMLElement) {
    if (!domNode) return;
    this.domNode = domNode;
    const syncNumbers = this.syncNumbers;
    const setValue = this.setValue;
    const cssClasses = this.cssClasses;

    this.sortableInst = new Sortable(domNode, {
      animation: 100,
      forceFallback: true,
      handle: "." + cssClasses.item,
      ghostClass: cssClasses.itemGhostMod,
      dragClass: cssClasses.itemDragMod,
      onStart() {
        (<any>Sortable.ghost.style.opacity) = 1;
        domNode.className += " " + cssClasses.rootDragMod;
      },
      onEnd() {
        domNode.className = domNode.className.replace(
          " " + cssClasses.rootDragMod,
          ""
        );
        setValue();
      },
      onChange(evt: any) {
        const indexNodes = domNode.querySelectorAll("." + cssClasses.itemIndex);
        const ghostNode = indexNodes[indexNodes.length - 1];
        syncNumbers();
        (<any>ghostNode).innerText = evt.newIndex + 1;
      },
    });
  }

  //TODO should calc only ones e.g. Survey.isMobile
  mobileCheck() {
    let check = false;
    (function (a) {
      if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
          a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substr(0, 4)
        )
      )
        check = true;
    })(navigator.userAgent || navigator.vendor || (<any>window).opera);
    return check;
  }

  get rootClass() {
    const css = this.cssClasses;
    if (this.mobileCheck()) return css.root + " " + css.rootMobileMod;
    return css.root;
  }

  handleKeydown = (event: any) => {
    const key = event.key;
    const array = this.domNode.querySelectorAll("." + this.cssClasses.item);
    const index = [].indexOf.call(array, event.target);

    if (key === "ArrowUp" && index) {
      this.handleArrowUp(index);
    }
    if (key === "ArrowDown" && index !== array.length - 1) {
      this.handleArrowDown(index);
    }
  };

  handleArrowUp = (index: number) => {
    const array = this.sortableInst.toArray();
    this.moveArrayItemBack(array, index);
    this.sortableInst.sort(array);

    this.syncNumbers();
    this.setValue();
    this.focusItem(index - 1);
  };

  handleArrowDown = (index: number) => {
    const array = this.sortableInst.toArray();
    this.moveArrayItemForward(array, index);
    this.sortableInst.sort(array);

    this.syncNumbers();
    this.setValue();
    this.focusItem(index + 1);
  };

  moveArrayItemBack = (array: string[], index: number) => {
    const temp = array[index];
    array[index] = array[index - 1];
    array[index - 1] = temp;
  };

  moveArrayItemForward = (array: string[], index: number) => {
    const temp = array[index];
    array[index] = array[index + 1];
    array[index + 1] = temp;
  };

  syncNumbers = () => {
    const indexNodes = this.domNode.querySelectorAll(
      "." + this.cssClasses.itemIndex
    );
    indexNodes.forEach((indexNode: any, index) => {
      indexNode.innerText = index + 1;
    });
  };

  focusItem = (index: number) => {
    const itemsNodes: any = this.domNode.querySelectorAll(
      "." + this.cssClasses.item
    );
    itemsNodes[index].focus();
  };

  setValue = () => {
    let value: string[] = [];
    const textNodes = this.domNode.querySelectorAll(
      "." + this.cssClasses.itemText
    );
    textNodes.forEach((textNode: any, index) => {
      value.push(textNode.innerText);
    });
    this.value = value;
  };
}

Serializer.addClass(
  "ranking",
  [
    { name: "hasNone", visible: false },
    { name: "noneText", visible: false },
    { name: "hasSelectAll", visible: false },
    { name: "selectAllText", visible: false },
    { name: "colCount:number", visible: false },
  ],
  function () {
    return new QuestionRankingModel("");
  },
  "checkbox"
);
QuestionFactory.Instance.registerQuestion("ranking", (name) => {
  var q = new QuestionRankingModel(name);
  q.choices = QuestionFactory.DefaultChoices;
  return q;
});
