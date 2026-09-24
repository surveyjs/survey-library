import { settings } from "../settings";
import { DomWindowHelper } from "../global_variables_utils";

export const reducedMotionMediaQuery = "(prefers-reduced-motion: reduce)";

interface IReducedMotionMedia {
  matches: boolean;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
  addListener?: (listener: () => void) => void;
  removeListener?: (listener: () => void) => void;
}

function getReducedMotionMedia(): IReducedMotionMedia | null {
  return DomWindowHelper.matchMedia(reducedMotionMediaQuery) as IReducedMotionMedia | null;
}

export function isReducedMotionPreferred(): boolean {
  if (!settings.respectReducedMotion) return false;
  const media = getReducedMotionMedia();
  return !!media && !!media.matches;
}

export function isAnimationEnabled(): boolean {
  return !!settings.animationEnabled && !isReducedMotionPreferred();
}

export function getScrollBehavior(): ScrollBehavior {
  return isAnimationEnabled() ? "smooth" : "auto";
}

export function subscribeReducedMotionChange(listener: () => void): () => void {
  const media = getReducedMotionMedia();
  if (!media) return () => {};
  const onChange = (): void => listener();
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", onChange);
    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", onChange);
      }
    };
  }
  if (typeof media.addListener === "function") {
    media.addListener(onChange);
    return () => {
      if (typeof media.removeListener === "function") {
        media.removeListener(onChange);
      }
    };
  }
  return () => {};
}
