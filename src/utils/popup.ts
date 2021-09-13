export type VerticalPosition = "top" | "bottom" | "middle";
export type HorizontalPosition = "left" | "right" | "center";
export interface IPosition {
  left?: number | string;
  top?: number | string;
}

export interface INumberPosition extends IPosition {
  left?: number;
  top?: number;
}

export interface ISize {
  width: number;
  height: number;
}

export class PopupUtils {
  public static calculatePosition(
    targetRect: ClientRect,
    height: number,
    width: number,
    verticalPosition: VerticalPosition,
    horizontalPosition: HorizontalPosition,
    showPointer: boolean
  ): INumberPosition {
    if (horizontalPosition == "center")
      var left = (targetRect.left + targetRect.right - width) / 2;
    else if (horizontalPosition == "left") left = targetRect.left - width;
    else left = targetRect.right;

    if (verticalPosition == "middle")
      var top = (targetRect.top + targetRect.bottom - height) / 2;
    else if (verticalPosition == "top") top = targetRect.top - height;
    else top = targetRect.bottom;

    if (showPointer) {
      if (horizontalPosition != "center" && verticalPosition != "middle") {
        if (verticalPosition == "top") {
          top = top + targetRect.height;
        } else {
          top = top - targetRect.height;
        }
      }
    }

    return { left: Math.round(left), top: Math.round(top) };
  }

  public static updateVerticalDimensions(
    top: number,
    height: number,
    windowHeight: number
  ) {
    let result;
    if (top < 0) {
      result = { height: height + top, top: 0 };
    } else if (height + top > windowHeight) {
      let newHeight = Math.min(height, windowHeight - top);
      result = { height: newHeight, top: top };
    }
    return result;
  }

  public static updateVerticalPosition(
    targetRect: ClientRect,
    height: number,
    verticalPosition: VerticalPosition,
    showPointer: boolean,
    windowHeight: number
  ): VerticalPosition {
    let deltaTop =
      height - (targetRect.top + (showPointer ? targetRect.height : 0));
    let deltaBottom =
      height +
      targetRect.bottom -
      (showPointer ? targetRect.height : 0) -
      windowHeight;
    if (deltaTop > 0 && deltaBottom <= 0 && verticalPosition == "top") {
      verticalPosition = "bottom";
    } else if (
      deltaBottom > 0 &&
      deltaTop <= 0 &&
      verticalPosition == "bottom"
    ) {
      verticalPosition = "top";
    } else if (deltaBottom > 0 && deltaTop > 0) {
      verticalPosition = deltaTop < deltaBottom ? "top" : "bottom";
    }
    return verticalPosition;
  }

  public static calculatePopupDirection(
    verticalPosition: VerticalPosition,
    horizontalPosition: HorizontalPosition
  ) {
    var popupDirection: string;
    if (horizontalPosition == "center" && verticalPosition != "middle") {
      popupDirection = verticalPosition;
    } else if (horizontalPosition != "center") {
      popupDirection = horizontalPosition;
    }
    return popupDirection;
  }

  //called when showPointer  is true
  public static calculatePointerTarget(
    targetRect: ClientRect,
    top: number,
    left: number,
    verticalPosition: VerticalPosition,
    horizontalPosition: HorizontalPosition
  ) {
    var targetPos: INumberPosition = {};
    if (horizontalPosition != "center") {
      targetPos.top = targetRect.top + targetRect.height / 2;
      targetPos.left = targetRect[horizontalPosition];
    } else if (verticalPosition != "middle") {
      targetPos.top = targetRect[verticalPosition];
      targetPos.left = targetRect.left + targetRect.width / 2;
    }
    targetPos.left = Math.round(targetPos.left - left);
    targetPos.top = Math.round(targetPos.top - top);
    return targetPos;
  }
}
