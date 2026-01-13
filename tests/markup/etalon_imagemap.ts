import { registerMarkupTest } from "./helper";

const i400x400 = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"></svg>');

// TODO: need delay for imagemap to load image
registerMarkupTest(
  {
    name: "Test ImageMap question markup",
    json: {
      elements: [
        {
          "type": "imagemap",
          "name": "q1",
          "imageLink": i400x400,
          "areas": [],
        }
      ]
    },
    event: "onAfterRenderQuestion",
    getElement: () => {

      // In vue viewBox is not set immediately after render
      // IDK why, but i just need correct markup (present img and svg)
      const svg = document.querySelector(".sd-imagemap-svg");
      if (svg && !svg.hasAttribute("viewBox")) {
        svg.setAttribute("viewBox", "0 0 400 400");
      }

      return document.querySelector(".sd-imagemap")?.parentNode as HTMLElement;
    },
    timeout: 10,
    snapshot: "imagemap"
  }
);