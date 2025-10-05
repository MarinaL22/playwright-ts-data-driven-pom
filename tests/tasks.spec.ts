import { test } from '@playwright/test';
import dataset from '../data/tasks.json';
import { LoginPage } from '../pages/LoginPage';
import { ProjectsPage } from '../pages/ProjectsPage';

type TaskData = {
  id: string;
  app: string;
  task: string;
  column: string;
  tags: string[];
};

const tasks: TaskData[] = dataset as TaskData[];

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login();
});

for (const t of tasks) {
  test(`${t.id} - Verify task "${t.task}" in ${t.app}`, async ({ page }) => {
    const projectsPage = new ProjectsPage(page);
    await projectsPage.verifyTask(t.app, t.column, t.task, t.tags);
  });
}
