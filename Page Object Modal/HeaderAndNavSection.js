const { expect } = require("@playwright/test");

exports.HeaderAndNavSection = class HeaderAndNavSection {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchBar = page.locator("#search");
    this.searchButton = page.locator(".action.search");
  }

  async searchAnItem(item) {
    await this.searchBar.fill(item);
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }
};
