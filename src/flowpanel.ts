import { PanelModelBase } from "./panel";

/**
 * The flow panel object. It is a container with flow layout where you can mix questions with mardown text.
 *
 */
export class FlowPanelModel extends PanelModelBase {
  constructor(name: string) {
    super(name);
  }
}
