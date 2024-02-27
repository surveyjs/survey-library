import { ArrayChanges, Base } from "../base";

export interface AnimationOptions<T> {
  classes: T;
  onBeforeRunAnimation?: (element: HTMLElement) => void;
}
export type OnEnterOptions = AnimationOptions<{ onEnter: string }>;
export type OnLeaveOptions = AnimationOptions<{ onLeave: string, onHide: string }>;

export class Animation {

  protected isAnimationExists(element: HTMLElement): boolean {
    let animationName = "";
    if(getComputedStyle) {
      animationName = getComputedStyle(element).animationName;
    }
    return animationName && animationName != "none";
  }

  protected onAnimationEnd(element: HTMLElement, callback: () => void): void {
    const onAnimationEndCallback = () => {
      callback();
      element.removeEventListener("animationend", onAnimationEndCallback);
    };
    if(this.isAnimationExists(element)) {
      element.addEventListener("animationend", onAnimationEndCallback);
    } else {
      onAnimationEndCallback();
    }
  }

  public onEnter(getElement: () => HTMLElement, options: OnEnterOptions): void {
    requestAnimationFrame(() => {
      const element = getElement();
      if(element) {
        options.onBeforeRunAnimation && options.onBeforeRunAnimation(element);
        element.classList.add(options.classes.onEnter);
        this.onAnimationEnd(element, () => {
          element.classList.remove(options.classes.onEnter);
        });
      }
    });
  }

  public onLeave(getElement: () => HTMLElement, callback: () => void, options: OnLeaveOptions): void {
    const element = getElement();
    if(element) {
      options.onBeforeRunAnimation && options.onBeforeRunAnimation(element);
      element.classList.add(options.classes.onLeave);
      const onAnimationEndCallback = () => {
        element.classList.remove(options.classes.onLeave);
        element.classList.add(options.classes.onHide);
        callback();
        setTimeout(() => {
          element.classList.remove(options.classes.onHide);
        }, 1);
      };
      this.onAnimationEnd(element, onAnimationEndCallback);
    } else {
      callback();
    }
  }
}

export class AnimationCollection<T> {
  constructor(private obj: Base, private propertyName: string, private animationOptions: { onEnter: OnEnterOptions, onLeave: OnLeaveOptions, getElement: (el: T) => HTMLElement }, private update: (arr: Array<T>) => void) {
    obj.registerFunctionOnPropertyValueChanged(propertyName, (newValue: Array<T>, arrayChanges: ArrayChanges<T>) => { this.sync(newValue, arrayChanges); }, "animation");
  }
  sync(array: Array<T>, { itemsToAdd, deletedItems }: ArrayChanges<T>): void {
    if(deletedItems.length != 0 && itemsToAdd.length == array.length) {
      itemsToAdd = array.filter((el) => deletedItems.indexOf(el) < 0);
      deletedItems = deletedItems.filter(el => array.indexOf(el) < 0);
    }
    itemsToAdd?.forEach((item) =>
      new Animation().onEnter(
        () => this.animationOptions.getElement(item),
        this.animationOptions.onEnter
      )
    );
    if (deletedItems?.length > 0) {
      let counter = deletedItems.length;
      deletedItems.forEach((item) => {
        new Animation().onLeave(
          () => this.animationOptions.getElement(item),
          () => {
            if (--counter <= 0) {
              if(!this.obj.isUIChangesBlocked) {
                this.update(array);
              }
            }
          },
          this.animationOptions.onLeave
        );
      });
    } else {
      if(!this.obj.isUIChangesBlocked) {
        this.update(array);
      }
    }
  }
  dispose() {
    this.obj.unRegisterFunctionOnPropertyValueChanged(this.propertyName, "animation");
  }
}

// watch(
//   () => props.page.rows.filter((row) => row.visible),
//   (newValue, oldValue) => {
//     if (oldValue) {
//       const addedRows = newValue.filter((el) => oldValue.indexOf(el) < 0);
//       const removedRows = oldValue.filter((el) => newValue.indexOf(el) < 0);
//       // rows.value = mergeArrays(oldValue, newValue);
//       // triggerRef(rows);
//       addedRows.forEach((row) =>
//         new Animation().onEnter(
//           () =>
//             document.getElementById(
//               (row as QuestionRowModel).id
//             ) as HTMLElement,
//           {
//             classes: { onEnter: "fadeIn" },
//             onBeforeRunAnimation: (el) => {
//               el.style.setProperty(
//                 "--animation-height",
//                 el.offsetHeight + "px"
//               );
//             },
//           }
//         )
//       );
//       if (removedRows.length > 0) {
//         let counter = removedRows.length;
//         removedRows.forEach((row) => {
//           new Animation().onLeave(
//             () =>
//               document.getElementById(
//                 (row as QuestionRowModel).id
//               ) as HTMLElement,
//             () => {
//               if (--counter <= 0) {
//                 rows.value = newValue;
//                 triggerRef(rows);
//               }
//             },
//             { classes: { onLeave: "fadeOut", onHide: "hidden" } }
//           );
//         });
//       } else {
//         rows.value = newValue;
//         triggerRef(rows);
//       }
//     } else {
//       rows.value = newValue;
//       triggerRef(rows);
//     }
//   },
//   { immediate: true }
// );