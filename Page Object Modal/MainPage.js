const { expect } = require("@playwright/test");

exports.MainPage = class MainPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchResultsText = page.locator(".base");
    this.productItem = page.locator(".product-item");
    this.productItemName = (i) =>
      this.productItem.nth(i).locator(".product-item-link");
    this.productItemPrice = (i) => this.productItem.nth(i).locator(".price");
    this.searchResults = page.locator(".results");
  }

  async verifySearchInput(searchedItem) {
    const searchItem = searchedItem;
    const itemNameDisplayed = await this.searchResultsText.textContent();

    expect(itemNameDisplayed).toBe(`Search results for: '${searchItem}'`);
  }

  async verifyDisplayedItemCount(expectedCount) {
    const actualCount = await this.productItem.count();
    expect(actualCount).toBe(expectedCount);
  }

  async verifyItemName(itemName) {
    const itemCount = await this.productItem.count();

    for (let i = 0; i < itemCount; i++) {
      const listedItemNames = (
        await this.productItemName(i).textContent()
      ).trim();
      expect(listedItemNames).toBe(itemName[i]);
    }
  }

  async verifyItemPrice(itemPrice) {
    const itemCount = await this.productItem.count();

    for (let i = 0; i < itemCount; i++) {
      const listedItemPrices = (
        await this.productItemPrice(i).textContent()
      ).trim();
      expect(listedItemPrices).toBe(itemPrice[i]);
    }
  }
};
