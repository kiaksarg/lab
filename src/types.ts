export type EntryStatus = "draft" | "review" | "final" | "archived";

export interface Entry {
  slug: string;
  title: string;
  summary: string;
  /** YYYY-MM-DD */
  date: string;
  project: string;
  tags: string[];
  status: EntryStatus;
  /** How the page was made, e.g. "Drafted with Claude; reviewed by …". Empty if not stated. */
  aiAssisted: string;
  listed: boolean;
  /** File name inside the entry folder, or "" */
  thumb: string;
}
