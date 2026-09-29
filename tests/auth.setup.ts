import { test as setup, expect } from '@playwright/test';
import { AUTH_STATE_PATH } from '../constants';

setup('log in to Wikipedia', async ({ page, baseURL }) => {
  const username = process.env.WIKI_USERNAME;
  const password = process.env.WIKI_PASSWORD;
  if (!username || !password) {
    throw new Error('WIKI_USERNAME and WIKI_PASSWORD must be set (see .env.example)');
  }

  await page.goto('/wiki/Main_Page');
  // Посилання "Log in" у хідері відкриває форму логіну на auth.wikimedia.org,
  // яка після введення логіна й пароля повертає на "Main Page"
  await page.locator('#pt-login-2').getByRole('link', { name: 'Log in' }).click();
  await page.locator('#wpName1').fill(username);
  await page.locator('#wpPassword1').fill(password);
  await page.locator('#wpLoginAttempt').click();

  const wikiOrigin = new URL(baseURL!).origin;
  await page.waitForURL((url) => url.origin === wikiOrigin && url.pathname === '/wiki/Main_Page');
  // Посилання на сторінку користувача в хідері присутнє лише для залогінених користувачів
  await expect(page.locator('#pt-userpage-2')).toBeAttached();

  await page.context().storageState({ path: AUTH_STATE_PATH });
});
