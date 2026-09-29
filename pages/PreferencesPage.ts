import { Dialog, Locator, Page } from '@playwright/test';

export class PreferencesPage {
  readonly heading: Locator;
  readonly internationalisationSection: Locator;
  readonly internationalisationLegend: Locator;
  readonly languageCombobox: Locator;
  readonly languageSelect: Locator;
  readonly saveButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.locator('#firstHeading');
    this.internationalisationSection = page.locator('#mw-prefsection-personal-i18n');
    this.internationalisationLegend = this.internationalisationSection.locator('legend');
    this.languageCombobox = this.internationalisationSection.getByRole('combobox');
    this.languageSelect = page.locator('#mw-input-wplanguage');
    this.saveButton = page.locator('#prefcontrol button');
  }

  async goto(): Promise<void> {
    await this.page.goto('/wiki/Special:Preferences');
  }

  /**
   * Гарантує, що мова інтерфейсу - ʼcode'; змінює її через UI лише за потреби.
   * Використовується для beforeEach і afterEach, тому не залежить від поточної мови інтерфейсу.
   */
  async ensureLanguage(code: string): Promise<void> {
    // Workaround:
    // Якщо тест, що впав, залишив незбережені зміни, MediaWiki під час переходу питає "Leave site?"
    const leaveUnsavedChanges = (dialog: Dialog) =>
      dialog.type() === 'beforeunload' ? dialog.accept() : dialog.dismiss();
    this.page.on('dialog', leaveUnsavedChanges);
    try {
      // URL без hash: перехід на ту саму сторінку з іншим hash браузер не перезавантажує,
      // і тоді ми б читали незбережений стан форми замість збереженого.
      await this.page.goto('/wiki/Special:Preferences');
    } finally {
      this.page.off('dialog', leaveUnsavedChanges);
    }

    if ((await this.languageSelect.inputValue()) === code) {
      return;
    }
    await this.selectLanguage(code);
    await this.save();
  }

  tab(name: string): Locator {
    return this.page.getByRole('tab', { name, exact: true });
  }

  async openTab(name: string): Promise<void> {
    await this.tab(name).click();
  }

  // Вибирає мову. Наприклад код "uk" відповідає опції "uk - українська"
  async selectLanguage(code: string): Promise<void> {
    // Прокручуємо розділ до верху екрана, щоб список мов відкрився повністю над панеллю з кнопкою Save.
    // Інакше панель перекриває опції, а прокрутка під час кліку закриває список.
    await this.internationalisationSection.evaluate((section) => section.scrollIntoView({ block: 'start' }));
    await this.languageCombobox.fill(code);
    await this.internationalisationSection
      .getByRole('option', { name: new RegExp(`^${code} · `) })
      .click();
  }

  // Відправляє форму і чекає, поки сторінка Preferences перезавантажиться
  async save(): Promise<void> {
    const reloaded = this.page.waitForEvent('framenavigated', (frame) => frame === this.page.mainFrame());
    await this.saveButton.click();
    await reloaded;
    await this.page.waitForLoadState('load');
  }
}
