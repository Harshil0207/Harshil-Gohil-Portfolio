/**
 * Refuses a capture that isn't the product.
 *
 * A bot interstitial, a consent wall or a 502 all screenshot perfectly happily,
 * and the result would ship on the index as if it were the client's software.
 * The pipeline treats that as the worst possible failure, so every capture is
 * checked before it is written and a suspect page is dropped instead.
 */

const TITLE = /just a moment|attention required|access denied|security check|verify|403 forbidden|error/i;

const BODY = [
  "verify you are human",
  "checking your browser",
  "enable javascript and cookies",
  "performing security verification",
  "ray id:",
  "cf-browser-verification",
  "are you a robot",
  "access to this page has been denied",
  "request blocked",
  "application error",
  "502 bad gateway",
  "503 service",
  "504 gateway",
];

const SELECTORS = [
  "#challenge-form",
  "#cf-challenge-running",
  ".cf-browser-verification",
  "#px-captcha",
  'iframe[src*="challenges.cloudflare.com"]',
  'iframe[title*="challenge" i]',
];

/** True while the page is still an interstitial rather than the site. */
export async function isChallenge(page) {
  const title = await page.title().catch(() => "");
  if (TITLE.test(title)) return `title: ${title}`;

  for (const selector of SELECTORS) {
    if (await page.locator(selector).first().count().catch(() => 0)) {
      return `element: ${selector}`;
    }
  }

  const text = await page
    .evaluate(() => (document.body?.innerText ?? "").slice(0, 4000).toLowerCase())
    .catch(() => "");
  const hit = BODY.find((phrase) => text.includes(phrase));
  if (hit) return `body: "${hit}"`;

  // A page that renders almost nothing is a failed load, not a hero.
  if (text.replace(/\s+/g, "").length < 40) return "body: nearly empty";

  return null;
}

/** Cloudflare's managed challenge usually clears itself; give it the chance. */
export async function settleChallenge(page, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let reason = await isChallenge(page);

  while (reason && Date.now() < deadline) {
    await page.waitForTimeout(1500);
    reason = await isChallenge(page);
  }
  return reason;
}
