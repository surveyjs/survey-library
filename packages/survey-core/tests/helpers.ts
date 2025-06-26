import { AdaptiveActionContainer, AdaptiveContainerUpdateOptions, UpdateResponsivenessMode } from "../src/actions/adaptive-container";

export class TestAdaptiveActionContainer extends AdaptiveActionContainer {
  updateCallback: (isResetInitialized: boolean) => void;
  protected update(options: AdaptiveContainerUpdateOptions): void {
    if (!!options.updateResponsivenessMode) {
      this.updateCallback && this.updateCallback(options.updateResponsivenessMode == UpdateResponsivenessMode.Hard);
    }
  }
}