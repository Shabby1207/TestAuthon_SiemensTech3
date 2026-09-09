# Playwright BDD Framework Guide (Web + Mobile)

## 1) What this framework is

This is a TypeScript BDD automation framework using:
- Playwright for browser automation
- Cucumber for feature-driven test scenarios (Given/When/Then)
- Page Object Model for reusable UI actions
- HTML reporting for execution results

It now supports:
- Web desktop testing (default)
- Mobile web testing using Playwright device emulation

Important limitation:
- Playwright in this framework is for web automation (desktop and mobile web emulation), not native mobile app UI automation.

## 2) Project structure and purpose

- `features/`
  - Write business-readable test scenarios (`.feature` files)
  - Example: `TC_01_Validating_HomePage_Objects.feature`

- `steps/`
  - Step definitions for Gherkin sentences in feature files
  - Example: `Given Launching Application` maps to TypeScript functions

- `pages/`
  - Page Object classes with reusable UI actions and validations
  - Keep selectors usage and page interactions here

- `selectors/`
  - JSON locator repositories (XPath/CSS)
  - Central place to maintain selectors

- `Lib/`
  - Common reusable helper actions and utilities
  - Example: click/fill/select wrappers, data helpers

- `src/`
  - Framework setup and lifecycle files
  - `Hooks.ts`: browser/context/page setup and teardown
  - `Custom-world.ts`: scenario context object
  - `CucumberReporter.ts` and `MultiCucumberReporter.ts`: report generation

- `testdata/`
  - Test input and runtime data files

- `test_results_BDD/`
  - Execution outputs: cucumber JSON, HTML reports, screenshots, traces

## 3) Where to write new test scripts

### A) New test scenario
1. Create or update a `.feature` file in `features/`.
2. Add scenarios and tags (example: `@TC03`, `@Smoke`).

### B) Implement steps
1. Add matching step methods in `steps/*.steps.ts`.
2. Keep assertions and flow checks in step files.

### C) Add page actions
1. Add reusable methods in `pages/*.ts`.
2. Keep low-level selector operations in page classes.

### D) Add or update selectors
1. Add selectors in `selectors/*.json`.
2. Reuse selector constants from page classes.

## 4) Mobile testing support added

Mobile support is implemented via Playwright device emulation in `src/Hooks.ts`.

New environment switches:
- `MOBILE_EMULATION`
  - `"false"` = desktop mode
  - `"true"` = mobile emulation mode
- `DEVICE_NAME`
  - Playwright device descriptor name
  - Examples: `Pixel 5`, `iPhone 14`, `Galaxy S9+`

When mobile mode is enabled, each scenario context is created with the selected device profile.

Note:
- This framework is configured to always prioritize `.env` values at runtime.
- Even if `MOBILE_EMULATION` or `DEVICE_NAME` are passed from terminal, `.env` values override them.

## 5) Setup and install

From project root:

```powershell
npm install
npx playwright install
```

## 6) How to run tests

### A) Run all tests (desktop)

```powershell
npm test
```

### B) Run tagged desktop suites

```powershell
npm run TC01
npm run TC02
npm run Smoke
npm run all
```

### C) Run mobile-emulated suites (new)

```powershell
npm run mobile:TC01
npm run mobile:TC02
npm run mobile:Smoke
npm run mobile:all
```

### D) See all supported Playwright mobile device names

```powershell
npm run mobile:devices
```

## 7) How to choose a custom mobile device

Option 1: update `.env`
- Set `MOBILE_EMULATION="true"`
- Set `DEVICE_NAME="iPhone 14"` (or another valid device)

Option 2: one-time PowerShell run

```powershell
$env:MOBILE_EMULATION="true"
$env:DEVICE_NAME="Pixel 5"
npx cucumber-js -f @cucumber/pretty-formatter --tags @TC01
```

## 8) Where to find test results

Primary output folder:
- `test_results_BDD/`

Useful result files/folders:
- `test_results_BDD/cucumber.json` (raw cucumber JSON)
- `test_results_BDD/Batch_cumber-report.html` (batch html if produced)
- `test_results_BDD/Cucumber_reports/` (single-run html reports)
- `test_results_BDD/MultiCucumber_Report/index.html` (combined report)
- `test_results_BDD/Playwright-Artifacts/screenshots/` (scenario screenshots)
- `test_results_BDD/Playwright-Artifacts/traces/` (Playwright trace zip files)

## 9) How reports are generated

- Most suite scripts call Cucumber and then run `src/CucumberReporter.ts`
- Combined summary can be generated with:

```powershell
npm run MultiCucumberReporter
```

## 10) Recommended best practices

- Keep feature files business-readable and stable.
- Keep step definitions thin; move UI mechanics into page classes.
- Keep selectors centralized in JSON files.
- Use scenario tags (`@Smoke`, `@TCxx`) for selective execution.
- Prefer robust selectors over brittle absolute XPaths when possible.

## 11) Important environment note

Current `.env` contains `PATH_VAL`.
Ensure it points to your actual local workspace path. If it is incorrect, some data read/write operations in hooks may fail.

For this framework, mobile mode is controlled only by `MOBILE_EMULATION` and `DEVICE_NAME` in `.env`.

## 12) Quick execution examples

Desktop smoke:

```powershell
npm run Smoke
```

Mobile smoke (iPhone emulation):

```powershell
npm run mobile:Smoke
```

Single suite on Android-like device:

```powershell
$env:MOBILE_EMULATION="true"
$env:DEVICE_NAME="Pixel 5"
npm run TC02
```