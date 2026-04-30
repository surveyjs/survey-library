import "vitest-canvas-mock";

(window as any).ResizeObserver = function () {
  return {
    observe: () => {},
    disconnect: () => {},
    unobserve: () => {},
  };
};

// Preact sets the SVG `xlink:href` attribute via setAttributeNS without a
// prefix, which jsdom serialises as plain `href`. The shared markup snapshots
// expect `xlink:href`, so add the prefix here so jsdom emits it.
const XLINK_NS = "http://www.w3.org/1999/xlink";
const originalSetAttributeNS = Element.prototype.setAttributeNS;
Element.prototype.setAttributeNS = function (
  namespace: string | null,
  qualifiedName: string,
  value: string
) {
  if (namespace === XLINK_NS && qualifiedName.indexOf(":") === -1) {
    qualifiedName = "xlink:" + qualifiedName;
  }
  return originalSetAttributeNS.call(this, namespace, qualifiedName, value);
};

// Preact sometimes uses plain setAttribute("href", ...) on SVG <use> elements
// (when the `xlinkHref` prop is set dynamically through compat). Snapshots
// expect "xlink:href", so rewrite the call here.
const originalSetAttribute = Element.prototype.setAttribute;
const originalRemoveAttribute = Element.prototype.removeAttribute;
Element.prototype.setAttribute = function (name: string, value: string) {
  // React strips `suppressContentEditableWarning`; Preact compat passes it
  // through as a literal DOM attribute. Filter it out so output matches
  // the React-generated snapshots.
  if (name === "suppresscontenteditablewarning") {
    return;
  }
  if (
    name === "href" &&
    (this as Element).tagName &&
    (this as Element).tagName.toLowerCase() === "use"
  ) {
    name = "xlink:href";
  }
  // The shared markup helper sorts attributes on descendant elements, but
  // not on the root element returned by onAfterRenderSurvey. Preact emits
  // attributes in a different order than React, which produces a diff for
  // tests whose root element has both `class` and `style` (alphabetical
  // expects class before style). Re-establish that order here when class
  // is set after style.
  if (name === "class" && this.hasAttribute("style")) {
    const styleVal = this.getAttribute("style") as string;
    originalRemoveAttribute.call(this, "style");
    const result = originalSetAttribute.call(this, "class", value);
    originalSetAttribute.call(this, "style", styleVal);
    return result;
  }
  return originalSetAttribute.call(this, name, value);
};
