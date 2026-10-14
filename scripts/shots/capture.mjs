#!/usr/bin/env node
/**
 * Step 1 of 3 — captures the real product.
 *
 * Writes a retina screenshot per project to `public/work/raw/`. These are the
 * only pixels in the finished asset that claim to be the client's software, so
 * nothing downstream is allowed to invent or repaint them: the ground behind and
 * the frame over them are decoration, this is the evidence.
 *
 * Because that is the one thing the pipeline must not get wrong, every capture is
 * checked before it lands. A bot interstitial or a failed load screenshots just
 * as cleanly as a hero, so a suspect page is dropped rather than written — and a
 * site that turns headless Chromium away is retried through real Chrome, which
 * most managed challenges let through.
 *
 * A refusal is a warning, not a failure: one blocked site must not stop the
 * other ten from reaching compose. The exit code is non-zero only when nothing
 * at all could be captured, or under `--strict`.
 *
 * Usage: node scripts/shots/capture.mjs [slug ...] [--force] [--headed] [--strict]
 */
import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import { readProjects, selected } from "./registry.mjs";
import { recipeFor, CONSENT_ACCEPT } from "./config.mjs";
import { settleChallenge } from "./guard.mjs";

const OUT = "public/work/raw";
const argv = process.argv.slice(2);
const force = argv.includes("--force");
const headedAlways = argv.includes("--headed");
const strict = argv.includes("--strict");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function dismissConsent(page) {
  for (const selector of CONSENT_ACCEPT) {
    try {
      const button = page.locator(selector).first();
      if (await button.isVisible({ timeout: 700 })) {
        await button.click({ timeout: 1500 });
        return selector;
      }
    } catch {
      // A selector that matches nothing is the normal case, not a failure.
    }
  }
  return null;
}

/**
 * One capture attempt under a given browser profile. Returns the reason the page
 * was rejected, or null once the screenshot is on disk.
 */
async function attempt(project, { channel, headless }) {
  const recipe = recipeFor(project.slug);

  const browser = await chromium.launch({
    headless,
    ...(channel ? { channel } : {}),
    // Several of these sites sit behind a managed bot challenge that reads the
    // automation flag and serves an interstitial instead of the page. These are
    // MCG's own client sites and this is one screenshot request per run, so the
    // flag is dropped rather than the capture.
    args: ["--disable-blink-features=AutomationControlled"],
  });

  try {
    const context = await browser.newContext({
      viewport: recipe.viewport,
      // Retina source, so the plate scales the shot down rather than up.
      deviceScaleFactor: recipe.scale,
      userAgent: UA,
      locale: "en-US",
      timezoneId: "Asia/Kolkata",
      colorScheme: "light",
      reducedMotion: "reduce",
    });

    const page = await context.newPage();

    const target = new URL(recipe.path, project.url).toString();
  await page.goto(target, { waitUntil: "domcontentloaded", timeout: 45_000 });

    try {
      await page.waitForLoadState("networkidle", { timeout: 20_000 });
    } catch {
      // Analytics beacons and open sockets keep some sites from ever going idle.
    }

    // Managed challenges usually clear on their own within a few seconds.
    const blocked = await settleChallenge(page);
    if (blocked) return blocked;

    if (recipe.consent === "accept") {
      const accepted = await dismissConsent(page);
      if (accepted) console.log(`     consent accepted via ${accepted}`);
    }

    // Hiding after the click: an accepted banner often leaves a residual bar, and
    // widgets mount late enough that an earlier pass would miss them.
    await page.addStyleTag({
      content: `${recipe.hide.join(",")} { display: none !important; }
                html { scrollbar-width: none !important; }
                ::-webkit-scrollbar { display: none !important; }`,
    });

    if (recipe.hideText.length) {
      const removed = await page.evaluate((phrases) => {
        let count = 0;
        for (const phrase of phrases) {
          for (const element of document.querySelectorAll("body *")) {
            if (!element.textContent?.includes(phrase)) continue;
            if (element.children.length > 2) continue;

            // The phrase sits in a span inside the bar; the bar is the thing
            // pinned to the viewport, so hide that rather than just the words.
            let bar = element;
            for (let hop = 0; hop < 4 && bar.parentElement; hop += 1) {
              const position = getComputedStyle(bar).position;
              if (position === "fixed" || position === "sticky") break;
              bar = bar.parentElement;
            }
            bar.style.setProperty("display", "none", "important");
            count += 1;
            break;
          }
        }
        return count;
      }, recipe.hideText);

      if (removed) console.log(`     hid ${removed} banner(s) by text`);
    }

    if (recipe.scrollY) {
      await page.evaluate((y) => window.scrollTo(0, y), recipe.scrollY);
    }

    await page.waitForTimeout(recipe.settle);

    // Re-checked after the wait: some sites challenge late, on a soft navigation.
    const late = await settleChallenge(page, 4000);
    if (late) return late;

    await page.screenshot({
      path: `${OUT}/${project.slug}.jpg`,
      type: "jpeg",
      quality: 90,
    });

    // The plate's window chrome names the address, so it reads the address that
    // was actually shot rather than assuming the project's own root.
    writeFileSync(
      `${OUT}/${project.slug}.json`,
      `${JSON.stringify({ url: target, viewport: recipe.viewport }, null, 2)}\n`,
    );

    return null;
  } finally {
    await browser.close();
  }
}

/** Headless first; real Chrome is slower to start and shows a window. */
function profiles() {
  const headed = [{ channel: "chrome", headless: false }];
  return headedAlways ? headed : [{ channel: undefined, headless: true }, ...headed];
}

const projects = selected(readProjects(), argv);
const capturable = projects.filter((project) => project.url);
const skipped = projects.filter((project) => !project.url);

mkdirSync(OUT, { recursive: true });

const failures = [];

for (const project of capturable) {
  const target = `${OUT}/${project.slug}.jpg`;
  if (!force && existsSync(target)) {
    console.log(`  ·  ${project.slug} — already captured (--force to redo)`);
    continue;
  }

  let rejected = null;
  let via = null;

  for (const profile of profiles()) {
    try {
      rejected = await attempt(project, profile);
      if (!rejected) {
        via = profile.channel ? `${profile.channel}, headed` : "chromium";
        break;
      }
    } catch (error) {
      rejected = error.message.split("\n")[0];
    }
  }

  if (rejected) {
    failures.push([project.slug, rejected]);
    console.log(`  ✗  ${project.slug} — refused: ${rejected}`);
  } else {
    console.log(`  ✓  ${project.slug} — ${new URL(recipeFor(project.slug).path, project.url)}  [${via}]`);
  }
}

for (const project of skipped) {
  console.log(`  ·  ${project.slug} — no public URL, nothing to capture`);
}

if (failures.length) {
  console.log(
    [
      "",
      `${failures.length} capture(s) refused. Nothing was written for them, so the`,
      "index keeps its previous asset rather than showing an interstitial.",
      "Retry one with:  npm run shots:capture -- <slug> --force --headed",
    ].join("\n"),
  );

  // Only a total washout is worth stopping the run: compose still has work to do
  // for every project whose capture is on disk, freshly taken or already there.
  const usable = capturable.filter((project) => existsSync(`${OUT}/${project.slug}.jpg`));
  if (strict || usable.length === 0) process.exit(1);
}
