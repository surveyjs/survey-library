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

export class Rect implements ISize, INumberPosition {
  constructor(private x: number, private y: number, public width: number, public height: number) { }
  public get left(): number {
    return this.x;
  }
  public get top(): number {
    return this.y;
  }
  public get right(): number {
    return this.x + this.width;
  }
  public get bottom(): number {
    return this.y + this.height;
  }
}

export class PopupUtils {
  public static bottomIndent = 16;

  public static calculatePosition(
    targetRect: Rect,
    height: number,
    width: number,
    verticalPosition: VerticalPosition,
    horizontalPosition: HorizontalPosition,
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

    if (horizontalPosition != "center" && verticalPosition != "middle") {
      if (verticalPosition == "top") {
        currentTop = currentTop + targetRect.height;
      } else {
        currentTop = currentTop - targetRect.height;
      }
    }

    return { left: Math.round(currentLeft), top: Math.round(currentTop) };
  }

  public static getCorrectedVerticalDimensions(
    top: number,
    height: number,
    windowHeight: number,
    verticalPosition: VerticalPosition,
    canShrink: boolean = true,
    margins: { top: number, bottom: number } = { top: 0, bottom: 0 }
  ) {
    let result;
    const maxHeight = windowHeight - PopupUtils.bottomIndent;
    if(verticalPosition === "top") {
      result = { height: height, top: top };
    }
    if (top < -margins.top) {
      result = { height: canShrink ? height + top : height, top: -margins.top };
    } else if (height + top > windowHeight) {
      let newHeight = Math.min(height, maxHeight - top);
      result = { height: canShrink ? newHeight : height, top: canShrink ? top : top - (height - newHeight) };
    }
    if (result) {
      result.height = Math.min(result.height, maxHeight);
      result.top = Math.max(result.top, -margins.top);
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
    targetRect: Rect,
    height: number,
    horizontalPosition: HorizontalPosition,
    verticalPosition: VerticalPosition,
    windowHeight: number
  ): VerticalPosition {
    if (verticalPosition === "middle") return verticalPosition;

    let deltaTop = height - (targetRect.top + (horizontalPosition !== "center" ? targetRect.height : 0));
    let deltaBottom = height + targetRect.bottom - (horizontalPosition !== "center" ? targetRect.height : 0) - windowHeight;
    if (deltaTop > 0 && deltaBottom <= 0 && verticalPosition == "top") {
      verticalPosition = "bottom";
    } else if (deltaBottom > 0 && deltaTop <= 0 && verticalPosition == "bottom") {
      verticalPosition = "top";
    } else if (deltaBottom > 0 && deltaTop > 0) {
      verticalPosition = deltaTop < deltaBottom ? "top" : "bottom";
    }
    return verticalPosition;
  }

  public static updateHorizontalPosition(
    targetRect: Rect,
    width: number,
    horizontalPosition: HorizontalPosition,
    windowWidth: number
  ): HorizontalPosition {
    if (horizontalPosition === "center") return horizontalPosition;

    let deltaLeft = width - targetRect.left;
    let deltaRight = width + targetRect.right - windowWidth;
    if (deltaLeft > 0 && deltaRight <= 0 && horizontalPosition == "left") {
      horizontalPosition = "right";
    } else if (deltaRight > 0 && deltaLeft <= 0 && horizontalPosition == "right") {
      horizontalPosition = "left";
    } else if (deltaRight > 0 && deltaLeft > 0) {
      horizontalPosition = deltaLeft < deltaRight ? "left" : "right";
    }
    return horizontalPosition;
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
    targetRect: Rect,
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
