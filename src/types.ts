export type ReportStatus = "draft" | "review" | "final" | "archived";

export interface Report {
  slug: string;
  title: string;
  summary: string;
  /** YYYY-MM-DD */
  date: string;
  project: string;
  tags: string[];
  status: ReportStatus;
  /** How the page was made, e.g. "Drafted with Claude; reviewed by …". Empty if not stated. */
  aiAssisted: string;
  listed: boolean;
  /** File name inside the report folder, or "" */
  thumb: string;
}
