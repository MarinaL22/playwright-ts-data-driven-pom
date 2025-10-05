import { Page, Locator, expect } from '@playwright/test';
import config from '../data/config.json';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[id="username"]');
    this.passwordInput = page.locator('input[id="password"]');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto(config.baseUrl);
  }

  async login() {
    await this.usernameInput.fill(config.credentials.username);
    await this.passwordInput.fill(config.credentials.password);
    await this.submitButton.click();
    await expect(this.page.locator('text=Projects')).toBeVisible();
  }
}
