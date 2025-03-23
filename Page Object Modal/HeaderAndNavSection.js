const { expect } = require("@playwright/test");

exports.HeaderAndNavSection = class HeaderAndNavSection {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchBar = page.locator("#search");
    this.searchButton = page.locator(".action.search");
    this.womenCategory = page.locator(".nav-sections .nav-2");
    this.manCategory = page.locator(".nav-sections .nav-3");
    this.manTops = this.manCategory.locator(".nav-3-1");
    this.manJackets = this.manTops.locator(".nav-3-1-1");
    this.manBottoms = this.manCategory.locator(".nav-3-2");
    this.manPants = this.manBottoms.locator(".nav-3-2-1")
    this.currentBreadcrumbs = page.locator(".breadcrumbs li");
  }

  async searchAnItem(item) {
    //This method searches for an item by using the searchbar in the app
    await this.searchBar.fill(item);
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async validateBreadCrumbs(breadCrumbs) {
    //This method verifies the breadcrumbs are properly displayed after navigating a certain location
    const countOfBreadCrumbs = await this.currentBreadcrumbs.count();

    for (let i = 0; i < countOfBreadCrumbs; i++) {
      const breadCrumb = (
        await this.currentBreadcrumbs.nth(i).textContent()
      ).trim();
      expect(breadCrumb).toBe(breadCrumbs[i]);
    }
  }
};
