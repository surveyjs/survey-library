import { registerMarkupTest } from "./helper";

const i400x400 = "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"></svg>');

// TODO: need delay for imagemap to load image
// registerMarkupTest(
//   {
//     name: "Test ImageMap question markup",
//     json: {
//       elements: [
//         {
//           "type": "imagemap",
//           "name": "q1",
//           "imageLink": i400x400,
//           "areas": [],
//         }
//       ]
//     },
//     event: "onAfterRenderQuestion",
//     getElement: () => {
//       return document.querySelector(".sd-imagemap") as HTMLElement;
//     },
//     timeout: 100,
//     snapshot: "imagemap"
//   }
// );