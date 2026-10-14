/**
 * The shape of one client system, and the contract for adding another.
 *
 * A project is authored as a single file in `content/projects/` and registered
 * in `content/projects/index.ts`. Everything derivable is derived there — the
 * catalogue number and the spec rail — so an author writes each fact once.
 */
export type Agency = "MulticodeGenius" | "SSVL Technologies" | "Independent";

export type ProjectInput = {
  agency: Agency;
  /** URL segment; must match the filename and be unique. */
  slug: string;
  name: string;
  /** Wide-tracked label above the name on the OG card. Uppercase. */
  kicker: string;
  category: string;
  /** A single year, or a range written with an em dash. */
  year: string;
  /** The client's ink, unique across the registry. Hex, lowercase or upper. */
  accent: string;
  /** One sentence a non-technical reader understands. */
  summary: string;
  /** How it was built: the paragraph under the title. */
  about: string;
  stack: string[];
  features?: { title: string; note: string }[];
  architecture?: { title: string; body: string }[];
  engineeringNote?: string;
  /** Shown as a full panel on the home page; every project is in the index. */
  featured?: boolean;
  /** Who it was built for, or "Personal project". */
  client: string;
  /** Your role on the project. */
  role: string;
  /** Truthful state, e.g. "Live · in production". Shown as a chip and a mark. */
  status: string;
  /** Both omitted until the system is publicly addressable under its own name. */
  domain?: string;
  url?: string;
  /**
   * What it does in production — facts, not marketing. Four at most: the rail
   * lays them out two-up. A published-by-client figure needs `outcomesFootnote`.
   */
  outcomes: { label: string; value: string }[];
  outcomesFootnote?: string;
  /** Omitted until a screenshot exists; a stand-in panel carries the slot. */
  image?: string;
  imageAlt?: string;
};

/** A registered project: the authored input plus what the registry derives. */
export type Project = ProjectInput & {
  /** Catalogue number, derived from registry order. */
  index: string;
  /**
   * The first clause of `status`, for the index rows where only a word fits.
   * Derived so a system in active development is never labelled "Live" by a
   * hard-coded string somewhere in the markup.
   */
  statusShort: string;
  spec: {
    client: string;
    year: string;
    role: string;
    category: string;
    status: string;
  };
};

/**
 * Identity with a type annotation. Authoring through this means an incomplete
 * project is a compile error at the file that owns it, not a runtime surprise
 * three components away.
 */
export function defineProject(project: ProjectInput): ProjectInput {
  return project;
}
