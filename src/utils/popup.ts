export type VerticalPosition = "top" | "bottom" | "middle";
export type HorizontalPosition = "left" | "right" | "center";
export type PositionMode = "flex" | "fixed";
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
  public static bottomIndent = 16;

  public static calculatePosition(
    targetRect: ClientRect,
    height: number,
    width: number,
    verticalPosition: VerticalPosition,
    horizontalPosition: HorizontalPosition,
    showPointer: boolean,
    positionMode: PositionMode = "flex"
  ): INumberPosition {
    let currentLeft = targetRect.left;
    let currentTop = targetRect.top;

    if(positionMode === "flex") {
      if (horizontalPosition == "center")
        currentLeft = (targetRect.left + targetRect.right - width) / 2;
      else if (horizontalPosition == "left") currentLeft = targetRect.left - width;
      else currentLeft = targetRect.right;
    }

    if (verticalPosition == "middle")
      currentTop = (targetRect.top + targetRect.bottom - height) / 2;
    else if (verticalPosition == "top") currentTop = targetRect.top - height;
    else currentTop = targetRect.bottom;

    if (showPointer) {
      if (horizontalPosition != "center" && verticalPosition != "middle") {
        if (verticalPosition == "top") {
          currentTop = currentTop + targetRect.height;
        } else {
          currentTop = currentTop - targetRect.height;
        }
      }
    }

    return { left: Math.round(currentLeft), top: Math.round(currentTop) };
  }

  public static getCorrectedVerticalDimensions(
    top: number,
    height: number,
    windowHeight: number,
    verticalPosition: VerticalPosition
  ) {
    let result;
    if(verticalPosition === "top") {
      result = { height: height, top: top };
    }
    if (top < 0) {
      result = { height: height + top, top: 0 };
    } else if (height + top > windowHeight) {
      let newHeight = Math.min(height, windowHeight - top - PopupUtils.bottomIndent);
      result = { height: newHeight, top: top };
    }
    return result;
  }

  public static updateHorizontalDimensions(
    left: number,
    width: number,
    windowWidth: number,
    horizontalPosition: HorizontalPosition,
    positionMode: PositionMode = "flex",
    margins: { left: number, right: number } = { left: 0, right: 0 }
  ) {
    width += (margins.left + margins.right);
    let newWidth = undefined, newLeft = left;

    if (horizontalPosition === "center") {
      if (positionMode === "fixed") {
        if (left + width > windowWidth) {
          newWidth = windowWidth - left;
        }
        newLeft -= margins.left;
      } else {
        if (left < 0) {
          newLeft = margins.left;
          newWidth = Math.min(width, windowWidth);
        } else if (width + left > windowWidth) {
          newLeft = windowWidth - width;
          newLeft = Math.max(newLeft, margins.left);
          newWidth = Math.min(width, windowWidth);
        }
      }
    }

    if (horizontalPosition === "left") {
      if (left < 0) {
        newLeft = margins.left;
        newWidth = Math.min(width, windowWidth);
      }
    }
    if (horizontalPosition === "right") {
      if (width + left > windowWidth) {
        newWidth = windowWidth - left;
      }
    }

    return { width: newWidth - margins.left - margins.right, left: newLeft };
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
    horizontalPosition: HorizontalPosition,
    marginLeft: number = 0,
    marginRight: number = 0
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
    if (horizontalPosition == "left") {
      targetPos.left -= marginLeft + marginRight;
    }
    if (horizontalPosition === "center") {
      targetPos.left -= marginLeft;
    }
    return targetPos;
  }
}
