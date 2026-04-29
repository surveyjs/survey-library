// Setup file for Vitest. Mirrors the side-effect imports and global settings
// from the Karma+QUnit entry barrel at tests/entries/test.ts.
import "../src/localization/russian";
import "../src/localization/french";
import "../src/localization/finnish";
import "../src/localization/german";
import { settings } from "../src/settings";

settings.animationEnabled = false;
settings.dropdownSearchDelay = 0;
