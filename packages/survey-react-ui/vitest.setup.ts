import "vitest-canvas-mock";

(<any>window).ResizeObserver = function () {
  return {
    observe: () => {},
    disconnect: () => {},
    unobserve: () => {},
  };
};
