import { DomDocumentHelper } from "../global_variables_utils";

/** Matches CSS color(srgb r g b) / color(srgb r g b / a) from canvas fillStyle. */
const SRGB_COLOR_FUNCTION_REGEX =
  /color\s*\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/i;

/** Matches #RRGGBB or RRGGBB (six hex digits). */
const HEX_RGB_6_REGEX = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

/** Matches #RGB shorthand (three hex digits). */
const HEX_RGB_3_REGEX = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

/** rgba(...) prefix, case-insensitive. */
const RGBA_PREFIX_REGEX = /^rgba\s*\(/i;

var canvasElement: HTMLCanvasElement;

function hex6ToRgbaString(r: string, g: string, b: string): string {
  return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, 1)`;
}

export function getRGBaColor(colorValue: string): string | null {
  if (colorValue == null || typeof colorValue !== "string") {
    return null;
  }
  const trimmedColor = colorValue.trim();
  if (!trimmedColor) {
    return null;
  }

  if (RGBA_PREFIX_REGEX.test(trimmedColor)) {
    return trimmedColor;
  }

  if (!canvasElement) {
    canvasElement = DomDocumentHelper.createElement("canvas") as HTMLCanvasElement;
    if (!canvasElement) {
      return null;
    }
  }
  const ctx = canvasElement.getContext("2d");
  if (!ctx) {
    return null;
  }

  ctx.fillStyle = "#000000";
  ctx.fillStyle = trimmedColor;
  const resolvedColor = ctx.fillStyle as string;

  const srgbMatch = resolvedColor.match(SRGB_COLOR_FUNCTION_REGEX);
  if (srgbMatch) {
    const r = parseFloat(srgbMatch[1]);
    const g = parseFloat(srgbMatch[2]);
    const b = parseFloat(srgbMatch[3]);
    const alpha = srgbMatch[4] != null && srgbMatch[4] !== "" ? parseFloat(srgbMatch[4]) : 1;
    if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(alpha)) {
      return null;
    }
    const r255 = Math.round(r * 255);
    const g255 = Math.round(g * 255);
    const b255 = Math.round(b * 255);
    return `rgba(${r255}, ${g255}, ${b255}, ${alpha})`;
  }

  if (RGBA_PREFIX_REGEX.test(resolvedColor)) {
    return resolvedColor;
  }

  const hex6 = HEX_RGB_6_REGEX.exec(resolvedColor);
  if (hex6) {
    return hex6ToRgbaString(hex6[1], hex6[2], hex6[3]);
  }

  const hex3 = HEX_RGB_3_REGEX.exec(resolvedColor);
  if (hex3) {
    return hex6ToRgbaString(
      hex3[1] + hex3[1],
      hex3[2] + hex3[2],
      hex3[3] + hex3[3]
    );
  }

  return null;
}
