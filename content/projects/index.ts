import type { Agency, Project, ProjectInput } from "../project-schema";
import aiqlKsa from "./aiql-ksa";
import aiqlMoh from "./aiql-moh";
import aiqlWebsite from "./aiql-website";
import auricEngineering from "./auric-engineering";
import draftboard from "./draftboard";
import evoGym from "./evo-gym";
import freeRoamThreeDWorld from "./free-roam-3d-world";
import fundSpinner from "./fund-spinner";
import goCart from "./go-cart";
import groceryShop from "./grocery-shop";
import hollowManor from "./hollow-manor";
import hrManagementSystem from "./hr-management-system";
import invoiceBilling from "./invoice-billing";
import littleland from "./littleland";
import llmFromScratch from "./llm-from-scratch";
import luxuraAviation from "./luxura-aviation";
import marketbot from "./marketbot";
import marovaEssence from "./marova-essence";
import mcgPortfolio from "./mcg-portfolio";
import moveWell from "./move-well";
import multicodegeniusWebsite from "./multicodegenius-website";
import nexaos from "./nexaos";
import raahi from "./raahi";
import resumedone from "./resumedone";
import smartbite from "./smartbite";
import softys from "./softys";
import stockAnalysis from "./stock-analysis";
import surgentStudio from "./surgent-studio";
import tirupatiForged from "./tirupati-forged";
import twoEightStore from "./two-eight-store";
import volumeElectronics from "./volume-electronics";

export type { Agency, Project, ProjectInput } from "../project-schema";

/**
 * The registry, in the order the site presents it. Adding a project is two
 * edits: a file in this directory, and its name in this list. Nothing else in
 * the codebase counts projects or hard-codes their order.
 */
const registered: ProjectInput[] = [
  marovaEssence,
  resumedone,
  aiqlWebsite,
  aiqlKsa,
  aiqlMoh,
  luxuraAviation,
  mcgPortfolio,
  multicodegeniusWebsite,
  hrManagementSystem,
  auricEngineering,
  volumeElectronics,
  groceryShop,
  littleland,
  smartbite,
  fundSpinner,
  softys,
  tirupatiForged,
  moveWell,
  surgentStudio,
  hollowManor,
  raahi,
  twoEightStore,
  nexaos,
  marketbot,
  draftboard,
  llmFromScratch,
  freeRoamThreeDWorld,
  stockAnalysis,
  goCart,
  invoiceBilling,
  evoGym,
];

/**
 * Derives what shouldn't be typed twice: the catalogue number comes from
 * position, and the spec rail restates fields the project already carries.
 */
function register(input: ProjectInput, position: number): Project {
  return {
    ...input,
    index: String(position + 1).padStart(2, "0"),
    statusShort: input.status.split("·")[0].trim(),
    spec: {
      client: input.client,
      year: input.year,
      role: input.role,
      category: input.category,
      status: input.status,
    },
  };
}

/**
 * Invariants that a type can't express. These run once at module load, so a
 * violation fails the build with the offending slug rather than shipping a
 * duplicate ink or a fifth outcome the two-column rail silently drops.
 */
function assertRegistry(all: Project[]) {
  const seen = new Map<string, string>();

  for (const project of all) {
    const where = `content/projects/${project.slug}.ts`;

    const slugClash = all.filter((other) => other.slug === project.slug);
    if (slugClash.length > 1) {
      throw new Error(`${where}: slug "${project.slug}" is registered twice`);
    }

    const ink = project.accent.toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(ink)) {
      throw new Error(`${where}: accent "${project.accent}" must be a 6-digit hex`);
    }
    const owner = seen.get(ink);
    if (owner) {
      throw new Error(
        `${where}: accent ${ink} already belongs to ${owner} — each project needs its own ink`,
      );
    }
    seen.set(ink, project.slug);

    // The outcomes rail is two columns; a fifth entry unbalances it.
    if (project.outcomes.length < 2 || project.outcomes.length > 4) {
      throw new Error(
        `${where}: ${project.outcomes.length} outcomes — the rail takes 2 to 4`,
      );
    }

    // A bare number reads as a claim, so it has to say whose claim it is.
    const hasFigure = project.outcomes.some((outcome) => /\d/.test(outcome.value));
    if (hasFigure && !project.outcomesFootnote) {
      throw new Error(
        `${where}: an outcome carries a figure, so outcomesFootnote must say who published it`,
      );
    }

    // A live-site link needs both halves, and a screenshot needs its alt text.
    if (Boolean(project.url) !== Boolean(project.domain)) {
      throw new Error(`${where}: url and domain are declared together or not at all`);
    }
    if (project.image && !project.image.startsWith("/work/")) {
      throw new Error(`${where}: image must live under /work/`);
    }
  }
}

export const projects: Project[] = registered.map(register);

assertRegistry(projects);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string): Project {
  const current = projects.findIndex((project) => project.slug === slug);
  return projects[(current + 1) % projects.length];
}

export const agencies: { name: Agency; note: string }[] = [
  { name: "MulticodeGenius", note: "Team projects" },
  { name: "SSVL Technologies", note: "Solo projects" },
  { name: "Independent", note: "Personal builds" },
];

export const projectsByAgency = agencies.map((agency) => ({
  ...agency,
  projects: projects.filter((project) => project.agency === agency.name),
}));

function yearsOf(year: string) {
  return year.match(/\d{4}/g)?.map(Number) ?? [0];
}

function latestYear(year: string) {
  return Math.max(...yearsOf(year));
}

function earliestYear(year: string) {
  return Math.min(...yearsOf(year));
}

function sortByYear(list: Project[]): Project[] {
  return list
    .map((project, order) => ({ project, order }))
    .sort(
      (a, b) =>
        latestYear(b.project.year) - latestYear(a.project.year) ||
        earliestYear(b.project.year) - earliestYear(a.project.year) ||
        a.order - b.order,
    )
    .map(({ project }, position) => ({
      ...project,
      index: String(position + 1).padStart(2, "0"),
    }));
}

export const featuredProjects: Project[] = sortByYear(
  projects.filter((project) => project.featured),
);

const agencyOrder: Partial<Record<Agency, string[]>> = {
  "SSVL Technologies": [
    "hr-management-system",
    "smartbite",
    "littleland",
    "auric-engineering",
    "softys",
    "fund-spinner",
    "tirupati-forged",
    "move-well",
    "surgent-studio",
  ],
};

function inAgencyOrder(agency: Agency, list: Project[]): Project[] {
  const order = agencyOrder[agency];
  const sorted = sortByYear(list);
  if (!order) return sorted;
  const rank = (slug: string) => {
    const position = order.indexOf(slug);
    return position === -1 ? order.length : position;
  };
  return sorted
    .map((project, position) => ({ project, position }))
    .sort((a, b) => rank(a.project.slug) - rank(b.project.slug) || a.position - b.position)
    .map(({ project }, position) => ({
      ...project,
      index: String(position + 1).padStart(2, "0"),
    }));
}

export const workByAgency = projectsByAgency.map((group) => ({
  ...group,
  projects: inAgencyOrder(group.name, group.projects),
}));

export const projectsByYear: Project[] = sortByYear(projects);
