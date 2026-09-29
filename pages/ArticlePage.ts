import { Locator, Page } from '@playwright/test';

export class ArticlePage {
  readonly readTab: Locator;
  readonly talkTab: Locator;
  readonly historyTab: Locator;

  constructor(private readonly page: Page) {
    this.readTab = page.locator('#ca-view');
    this.talkTab = page.locator('#ca-talk');
    this.historyTab = page.locator('#ca-history');
  }

  async goto(title: string): Promise<void> {
    await this.page.goto(`/wiki/${encodeURIComponent(title)}`);
  }
}
