// The global state of the per-survey property defaults (survey-property-defaults.ts). A module without imports,
// so jsonobject.ts can read it without an import cycle.
export const propertyDefaultsState = {
  // Live surveys with property defaults. While it is 0, Base.getDefaultPropertyValue runs its old path only.
  liveLayerCount: 0
};
// Returned when a survey's property defaults do not set the property
export const propertyDefaultNotSet: any = {};
