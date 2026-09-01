import { Component, ElementRef, Input, OnChanges, OnInit, Renderer2 } from "@angular/core";
import { getStylesNonce } from "survey-core";

// Renders a real <style> element instead of injecting one through [innerHTML]: an
// element parsed from innerHTML cannot carry a nonce, so a strict `style-src` CSP
// refuses it. A <style> tag cannot be placed in an Angular template either (the
// compiler would extract it as component styles), hence the imperative creation.
@Component({
  selector: "sv-ng-theme-style",
  template: ""
})
export class ThemeStyleComponent implements OnInit, OnChanges {
  @Input() css!: string;
  private styleElement?: HTMLStyleElement;
  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }
  ngOnInit(): void {
    // Keep the empty host element out of the layout (and of selectors such as
    // `> :first-child`). Set through CSSOM rather than component styles: Angular 12
    // injects component styles as nonce-less <style> elements, which a strict
    // `style-src` CSP refuses - the very thing this component exists to avoid.
    this.renderer.setStyle(this.elementRef.nativeElement, "display", "none");
    this.styleElement = this.renderer.createElement("style");
    const nonce = getStylesNonce();
    if (!!nonce) {
      this.renderer.setProperty(this.styleElement, "nonce", nonce);
      this.renderer.setAttribute(this.styleElement, "nonce", nonce);
    }
    this.renderer.appendChild(this.elementRef.nativeElement, this.styleElement);
    this.updateCss();
  }
  ngOnChanges(): void {
    this.updateCss();
  }
  private updateCss(): void {
    if (!this.styleElement) return;
    this.renderer.setProperty(this.styleElement, "textContent", this.css || "");
  }
}
