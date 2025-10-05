import { Page, expect } from '@playwright/test';

export class ProjectsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openApplication(appName: string) {
    // Click the sidebar button in <nav> that contains an <h2> with the app name
    await this.page.locator('nav').locator(`button:has(h2:has-text("${appName}"))`).click();

    // Wait until the header shows the selected app (simple visibility assertion)
    await expect(this.page.locator(`header h1:has-text("${appName}")`)).toBeVisible();
  }

  async verifyTask(app: string, columnName: string, taskTitle: string, tags: string[]) {
    await this.openApplication(app);

    // A column is a div.w-80 that contains an <h2> with the column name (e.g., "To Do", "In Progress").
    // Counters like "(2)" are fine because :has-text() matches substrings.
    const columnContainer = this.page
      .locator('main div.w-80')
      .filter({ has: this.page.locator(`h2:has-text("${columnName}")`) });

    await expect(columnContainer, `Column "${columnName}" should be visible`).toBeVisible();

    // Within that column, the task card is the div whose direct child <h3> has the task title.
    const card = columnContainer.locator(`div:has(> h3:has-text("${taskTitle}"))`).first();

    // Ensure the task title is visible
    await expect(card.locator('h3'), `Task "${taskTitle}" should be visible`).toHaveText(taskTitle);

    // Verify each expected tag chip (spans with exact text) is present inside the same card
    for (const tag of tags) {
      await expect(
        card.getByText(tag, { exact: true }),
        `Tag "${tag}" should be visible on "${taskTitle}"`
      ).toBeVisible();
    }
  }
}