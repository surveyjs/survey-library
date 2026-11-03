import { Base, LocalizableString } from "survey-core";
import { findUnsupported, isLossless, UnsupportedHit } from "./lossless";

export interface IRichTextConverterContext {
  inline: boolean;
  element?: Base;
  name?: string;
}

export interface IRichTextConverter {
  toHtml(source: string, context: IRichTextConverterContext): string;
  toSource(root: HTMLElement, context: IRichTextConverterContext): string;
  lossless?: boolean;
  checkLossless?(source: string, context: IRichTextConverterContext): boolean;
  getUnsupported?(source: string): string[];
}

export type RichTextFormat = "markdown" | "html";

export class RichText {
  public static defaultFormat: RichTextFormat = "markdown";
  public static getEditMode: (owner: Base, name: string, locStr: LocalizableString, defaultMode: "none" | "inline" | "block") => "none" | "inline" | "block" = (_owner, _name, _locStr, defaultMode) => defaultMode;

  public static registerFormat(format: RichTextFormat, converter: IRichTextConverter): void {
    converters[format] = converter;
  }

  public static getFormat(format: RichTextFormat): IRichTextConverter {
    return converters[format];
  }

  public static isLossless(source: string, format: RichTextFormat, context: IRichTextConverterContext): boolean {
    return isLossless(source, format, context);
  }

  public static findUnsupported(survey: any, format?: RichTextFormat): UnsupportedHit[] {
    return findUnsupported(survey, format);
  }
}

const converters: { [format: string]: IRichTextConverter } = {};

export function installConverters(markdown: IRichTextConverter, html: IRichTextConverter): void {
  converters.markdown = markdown;
  converters.html = html;
}

export type { UnsupportedHit };
