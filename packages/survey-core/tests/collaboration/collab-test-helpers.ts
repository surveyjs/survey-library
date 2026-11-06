import { SurveyModel } from "survey-core";
import { CollaborationPlugin, ICollaborationOptions } from "../../src/plugins/collaboration/index";

// A plugin left alive keeps its presence overlay ticking, and without a rendered survey the
// overlay watches document.body: the body of whichever test file the worker runs next.
const plugins: Array<CollaborationPlugin> = [];

export function createPlugin(survey: SurveyModel, options?: ICollaborationOptions): CollaborationPlugin {
  const plugin = new CollaborationPlugin(survey, options);
  plugins.push(plugin);
  return plugin;
}

// Each test file registers afterEach(disposePlugins) itself: a hook registered in this module
// would bind to the first file that imports it, since the module is evaluated once per worker.
export function disposePlugins(): void {
  plugins.splice(0).forEach(plugin => plugin.dispose());
}
