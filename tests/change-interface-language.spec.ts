import { test, expect } from '@playwright/test';
import { PreferencesPage } from '../pages/PreferencesPage';
import { ArticlePage } from '../pages/ArticlePage';
import { ENGLISH, UKRAINIAN } from '../test-data/languages';

const FROM = ENGLISH;
const TO = UKRAINIAN;
const ARTICLE = 'Facebook';

test.describe('Preferences › User profile › Internationalisation', () => {
  // Передумова: починаємо з англійського інтерфейсу незалежно від того, що залишилось від попереднього запуску
  test.beforeEach(async ({ page }) => {
    await new PreferencesPage(page).ensureLanguage(FROM.code);
  });

  // Відкочуємо назад зміни налаштувань, щоб наступний запуск починався з такого ж стану
  test.afterEach(async ({ page }) => {
    await new PreferencesPage(page).ensureLanguage(FROM.code);
  });

  test('TC-01: authorised user switches the interface language from English to Ukrainian', async ({ page }) => {
    const preferences = new PreferencesPage(page);
    const article = new ArticlePage(page);

    // Відкриваємо сторінку Preferences
    await test.step('Open Preferences', async () => {
      await preferences.goto();
      await expect(preferences.heading).toHaveText(FROM.preferencesHeading);
    });

    // Відкриваємо вкладку "User profile"
    await test.step('Open the "User profile" tab', async () => {
      await preferences.openTab(FROM.userProfileTab);
      await expect(preferences.tab(FROM.userProfileTab)).toHaveAttribute('aria-selected', 'true');
      await expect(preferences.internationalisationLegend).toHaveText(FROM.internationalisationSection);
    });

    // Вибираємо Українську мову в секції "Internationalisation"
    await test.step(`Select "${TO.code}" in the "Internationalisation" section`, async () => {
      await preferences.selectLanguage(TO.code);
      await expect(preferences.languageCombobox).toHaveValue(TO.autonym);
      await expect(preferences.saveButton).toBeEnabled();
    });

    // Зберігаємо зміни
    await test.step('Save preferences', async () => {
      await preferences.save();
    });

    // Перевіряємо чи змінилась мова інтерфейсу на сторінці Preferences
    await test.step('Check if the interface language is changed on the Preferences page', async () => {
      await expect(preferences.heading).toHaveText(TO.preferencesHeading);
      await expect(preferences.tab(TO.userProfileTab)).toHaveAttribute('aria-selected', 'true');
      await expect(preferences.internationalisationLegend).toHaveText(TO.internationalisationSection);
      await expect(preferences.saveButton).toHaveText(TO.saveButton);
      await expect(preferences.languageCombobox).toHaveValue(TO.autonym);
      await expect(preferences.languageSelect).toHaveValue(TO.code);
    });

    // Перевіряємо чи змінилась мова інтерфейсу роботи зі статтею на сторінці статті.
    // Не сама мова статті, див. README.md для деталей.
    await test.step('Check if interface language is changed on the article page', async () => {
      await article.goto(ARTICLE);
      await expect(article.readTab).toHaveText(TO.readTab);
      await expect(article.talkTab).toHaveText(TO.talkTab);
      await expect(article.historyTab).toHaveText(TO.historyTab);
    });
  });
});
