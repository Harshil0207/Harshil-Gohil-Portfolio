/**
 * Capture recipes.
 *
 * A live marketing site is not a clean subject: consent dialogs cover the fold,
 * chat widgets float over the corner, and hero animations are mid-flight when
 * the network goes idle. The defaults here handle the common cases; a project
 * only needs an entry in CAPTURE when its own site does something unusual.
 */

export const DEFAULTS = {
  /**
   * Wide enough that a desktop layout doesn't collapse to its tablet break, and
   * deliberately short: a full 900px-tall fold trails off into empty page below
   * the hero, and that emptiness is what made the old screenshots look flat.
   * The plate's window is cut to this same ratio, so what is captured is what is
   * shown — no crop guesses downstream.
   */
  viewport: { width: 1440, height: 780 },
  /** Retina source, so the plate can scale the shot down rather than up. */
  scale: 2,
  /** Milliseconds to let hero animations land after the network goes quiet. */
  settle: 2600,
  /** Pixels to scroll before shooting, for sites whose fold is not the subject. */
  scrollY: 0,
  /**
   * "accept" clicks the consent dialog away, which is what most sites need
   * before they will render their hero media. "hide" removes the dialog without
   * answering it — for a site that breaks on the accept path.
   */
  consent: "accept",
  /** Path appended to the project's URL. The window chrome states it verbatim. */
  path: "/",
  /**
   * Phrases whose banner should go. Matching on words rather than selectors is
   * deliberate: these sites are built in Tailwind, so their bars have no stable
   * id or class, and a utility-class selector breaks on the next deploy while
   * the copy in a promo strip outlives it.
   */
  hideText: [],
};

/** Clicked in order, first match wins. Accepting beats hiding: some sites
 *  lock scroll or defer hero media until consent is answered. */
export const CONSENT_ACCEPT = [
  "#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll",
  "#CybotCookiebotDialogBodyButtonAccept",
  "#onetrust-accept-btn-handler",
  ".cc-btn.cc-allow",
  'button[aria-label*="Accept" i]',
  'button:has-text("Accept all")',
  'button:has-text("Allow all")',
  'button:has-text("Accept")',
  'button:has-text("I agree")',
  'button:has-text("Got it")',
];

/** Hidden outright — floating widgets that no click dismisses. */
export const HIDE = [
  '[id*="cookie" i]',
  '[class*="cookie" i]',
  '[id*="consent" i]',
  '[class*="consent" i]',
  "#CybotCookiebotDialog",
  ".intercom-lightweight-app",
  "#intercom-container",
  "#crisp-chatbox",
  "#tidio-chat",
  '[id*="tawk" i]',
  '[class*="whatsapp" i]',
  '[id*="wonderpush" i]',
  '[class*="wonderpush" i]',
  '[aria-label*="chat" i]',
  // Dated promo bars. A "until Sept 30" strip is true for a fortnight and then
  // makes the whole asset look abandoned, so it never belongs in a plate.
  '[class*="announcement" i]',
  '[id*="announcement" i]',
  '[class*="promo-bar" i]',
  '[class*="promobar" i]',
  '[class*="promo-banner" i]',
  "[data-promo]",
];

export const CAPTURE = {
  // Accepting Cookiebot on this site throws a client-side application error on
  // the homepage — reproducible, and a real defect on the live product rather
  // than a capture problem. Until it is fixed there, the banner is hidden
  // instead of answered, which leaves the page intact.
  // Two problems on the homepage, both on the live product rather than here:
  // accepting Cookiebot throws a client-side application error, and the page
  // intermittently throws it unprompted. /browse is stable, and a listing page
  // full of real toplines shows more of what was built than the hero does.
  toplinebase: {
    settle: 4200,
    consent: "hide",
    path: "/browse",
    // A dated offer strip. True this fortnight, and evidence of an abandoned
    // site once the date passes.
    hideText: ["VocalRig is out"],
  },
  // The beta is a Vercel preview: cold starts show a skeleton at idle.
  scg: { settle: 4800 },
  // The fold is a slow-fading hero video; the section under it is the product.
  "bombay-canvas": { settle: 4200 },
};

export function recipeFor(slug) {
  const recipe = { ...DEFAULTS, ...(CAPTURE[slug] ?? {}) };
  // Per-project selectors add to the shared list rather than replacing it.
  recipe.hide = [...HIDE, ...(CAPTURE[slug]?.hide ?? [])];
  recipe.hideText = [...DEFAULTS.hideText, ...(CAPTURE[slug]?.hideText ?? [])];
  return recipe;
}
