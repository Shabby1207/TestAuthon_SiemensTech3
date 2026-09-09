# Playwright BDD Framework Guide (Latest)

Last updated: 2026-09-09

## 1) Framework snapshot

This repository is a TypeScript BDD automation framework built primarily on:

- Playwright (browser automation)
- Cucumber (Gherkin + step execution)
- Page Object Model (reusable page actions)
- HTML report generation (single-run and aggregated)

Primary execution path is Cucumber + hooks, not Playwright Test runner.

## 2) Current technology and versions

From package configuration:

- Node package: Demo_Project
- Playwright: 1.38.1 (dependency)
- Playwright Test: ^1.63.0 (devDependency)
- Cucumber core: @cucumber/cucumber 7.3.2
- TypeScript: ^4.9.4
- ts-node: 10.9.1

## 3) Repo structure (what each folder does)

- features/
  - Feature files and tags (business-readable scenarios)
- steps/
  - Step definition implementations
- pages/
  - Page Objects and reusable page-level actions
- selectors/
  - JSON selectors used by page classes
- Lib/
  - Shared helpers and web actions
- src/
  - Runtime glue code (hooks, world, config, reporters)
- testdata/
  - Input and runtime data files
- test_results_BDD/
  - Cucumber JSON, HTML reports, screenshots, traces

## 4) How execution works now

### Core flow

1. Cucumber runs scenarios by tag or full suite.
2. src/Hooks.ts creates browser + context + page.
3. Steps call pages and shared actions.
4. After scenario execution:
   - screenshot and trace artifacts are captured on failures
   - cucumber.json is copied and per-suite HTML reports are generated

### Browser and context behavior

- Browser comes from BROWSER env (default: chromium).
- Chromium launch uses channel from CHROMIUM_CHANNEL or chrome.
- Dialogs are auto-dismissed.
- Unexpected popup tabs are auto-closed unless URL indicates checkout/payment flow.

## 5) Mobile web emulation (current behavior)

Mobile mode is supported through environment variables consumed in src/Hooks.ts:

- MOBILE_EMULATION
  - true -> mobile emulation context
  - false -> desktop context
- DEVICE_NAME
  - Playwright device descriptor (default: Pixel 5)

Important runtime note:

- dotenv is loaded with override: true, so values in .env override same-named variables passed from terminal.
- If you need to switch device or mobile mode for a run, update .env first.

List valid Playwright device names with:

```powershell
npm run mobile:devices
```

## 6) Available feature tags

Current tags discovered in feature files:

- @all
- @TC01
- @TC02
- @TC03
- @TC04
- @TC05
- @TC06
- @Smoke
- @mobile
- @TCM01
- @E2E
- @Language_English
- @Language_Hinglish

## 7) NPM scripts (latest)

### Common runs

```powershell
npm test
npm run all
npm run Smoke
npm run TC01
npm run TC02
npm run TC05
npm run TC06
npm run Retest
npm run Language_English
npm run Language_Hinglish
```

### Mobile-labeled runs

```powershell
npm run mobile:TC01
npm run mobile:TC02
npm run mobile:TC03
npm run mobile:TC04
npm run mobile:Smoke
npm run mobile:all
```

Note: mobile:* scripts currently run the same cucumber commands as desktop scripts. Actual mobile behavior depends on MOBILE_EMULATION and DEVICE_NAME from .env.

### Parallel and reporting

```powershell
npm run test:parallel
npm run MultiCucumberReporter
```

## 8) Setup

From repository root:

```powershell
npm install
npx playwright install
```

Recommended:

- Keep .env PATH_VAL aligned with local repo path.
- Verify .env URLs and credentials before running Gajab flows.

## 9) Where outputs are generated

- test_results_BDD/cucumber.json
- test_results_BDD/Batch_cumber-report.html
- test_results_BDD/Cucumber_reports/
- test_results_BDD/MultiCucumber_Report/index.html
- test_results_BDD/Playwright-Artifacts/screenshots/
- test_results_BDD/Playwright-Artifacts/traces/

## 10) How to add or update tests

1. Add or update a .feature file in features/.
2. Add matching steps in steps/*.steps.ts.
3. Reuse or add page actions in pages/*.ts.
4. Store selectors in selectors/*.json.
5. Execute by tag using npm scripts.

## 11) Practical cautions

- PATH_VAL is used by hooks for read/write under testdata/. Wrong value can break scenario data setup.
- playwright.config.ts exists for Playwright Test runner usage, but day-to-day framework execution is Cucumber-driven.
- There is currently no dedicated npm script named TC03 or TC04 (non-mobile). Use a direct cucumber command with tag if needed.

## 12) Quick commands

Desktop smoke:

```powershell
npm run Smoke
```

Run TC05:

```powershell
npm run TC05
```

Run TC03 by tag directly:

```powershell
npx cucumber-js -f @cucumber/pretty-formatter --tags @TC03
```

Enable mobile mode (via .env):

```env
MOBILE_EMULATION="true"
DEVICE_NAME="Pixel 5"
```