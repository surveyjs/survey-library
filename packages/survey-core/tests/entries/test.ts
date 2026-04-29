// common
// All test files have been migrated to Vitest. This barrel only retains
// localization side-effect imports for any remaining Karma run.

// localization
import "../../src/localization/russian";
import "../../src/localization/french";
import "../../src/localization/finnish";
import "../../src/localization/german";
import { settings } from "../../src/settings";

settings.animationEnabled = false;
settings.dropdownSearchDelay = 0;
