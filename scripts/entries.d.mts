import type { Entry } from "../src/types";
export declare const STATUSES: readonly Entry["status"][];
export declare function collectEntries(root: string): {
  entries: Entry[];
  errors: string[];
  warnings: string[];
};
