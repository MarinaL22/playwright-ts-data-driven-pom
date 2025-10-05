# Playwright + TypeScript — Data-Driven POM (Kanban Demo)

**Test automation using Playwright + TypeScript with data-driven tests (JSON) and Page Object Model for a Kanban demo app.**  
Focuses on clarity, maintainability, and selector hygiene.

## Highlights

- **Data-Driven Testing (DDT):** scenarios live in a single JSON (`/data/tasks.json`) and drive test creation at runtime.  
- **Selector hygiene:** CSS with `:has(...)` / `:has-text(...)` and scoped locators (no XPath), semantic targets where possible.  
- **Single source of truth:** credentials & base URL in `/data/config.json`.  
- **Stable test naming:** dataset includes `id` fields (`TC001…`) for clean reports.  
- **Cross-browser matrix:** Chromium, WebKit via Playwright projects.  
- **DX & resilience:** auto-wait `expect(...)` assertions, HTML report, screenshots/video on failure, trace on retry.

## Project Structure

```
data/
  config.json       # baseUrl + credentials (username/password)
  tasks.json        # data-driven scenarios (TC001…TC006)
pages/
  LoginPage.ts      # login flow (ID-based selectors)
  ProjectsPage.ts   # board interactions without XPath
tests/
  tasks.spec.ts     # generates 1 test per dataset row
playwright.config.ts
tsconfig.json
package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- (Recommended) VS Code + Playwright Test extension

### Install & Run
```bash
npm i
npx playwright install
npm test          # headless run
npm run test:ui   # Playwright UI
npm run report    # open HTML report (after a run)
```

## Data-Driven Tests

`/data/tasks.json` contains one object per scenario. Each entry maps to a single test:

```json
[
  {
    "id": "TC001",
    "app": "Web Application",
    "task": "Implement user authentication",
    "column": "To Do",
    "tags": ["Feature", "High Priority"]
  },
  {
    "id": "TC002",
    "app": "Mobile App",
    "task": "Add push notifications",
    "column": "In Progress",
    "tags": ["Feature"]
  }
]
```

The test suite iterates over the dataset and creates a spec for each row:

```ts
// tests/tasks.spec.ts (excerpt)
// Creates one test per dataset row and verifies the task titles/tags in the expected column.
for (const t of tasks) {
  test(`${t.id} - Verify task "${t.task}" in ${t.app}`, async ({ page }) => {
    // login is executed in beforeEach; then we check column + card + tags
  });
}
```

## Configuration & Secrets

`/data/config.json` centralizes the base URL and credentials:

```json
{
  "baseUrl": "https://animated-gingersnap-8cf7f2.netlify.app/",
  "credentials": {
    "username": "admin",
    "password": "password123"
  }
}
```

> For real projects, prefer environment variables or secret managers over committed JSON.

## Test Runner & Reports

- **Playwright projects**: Chromium / Firefox / WebKit via `playwright.config.ts`.  
- **HTML reporter**: `npm run report` after a run.  
- **Artifacts**: screenshots/video on failure, trace on first retry.

## CI

This project runs automated tests in GitHub Actions on every push and pull request.  
Tests execute in parallel across **Chromium** and **WebKit** with sharding.  
Each run uploads HTML reports and (optionally) traces/screenshots as artifacts.

👉 See the full workflow file here:  
[.github/workflows/playwright-ci.yml](.github/workflows/playwright-ci.yml)

## Troubleshooting

- **Strict mode violations**: scope locators (e.g., target a specific region or disambiguate via `filter({ has: ... })`).  
- **Flaky visibility**: keep `expect(...).toBeVisible()` — Playwright auto-waits; avoid manual sleeps.  
- **Local debug**: `npm run test:ui` + Playwright Inspector; use `page.pause()` in tricky spots.

## Why this approach?

- **Maintainability**: data-driven scenarios keep specs small and readable; changes to selectors live in page files.  
- **Robustness**: CSS selectors with `:has(...)` reduce coupling to brittle classes; assertions auto-wait.  
- **Reusability**: login is a single flow reused across all tests.

---

## Author

**Marina Lozko** ([@MarinaL22](https://github.com/MarinaL22))
