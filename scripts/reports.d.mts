import type { Report } from "../src/types";
export declare const STATUSES: readonly Report["status"][];
export declare function collectReports(root: string): {
  reports: Report[];
  errors: string[];
  warnings: string[];
};
