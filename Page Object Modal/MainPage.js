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
    this.currentFilters = page.locator(".filter-current .filter-value");
    this.selectedFilterValue = this.currentFilters.locator(".filter-value");
    this.styleFilters = page.locator(".filter-options-item", {
      hasText: "Style",
    });
    this.baseLayer = this.styleFilters.locator("a").nth(0);
    this.colorFilters = page.locator(".filter-options-item", {
      hasText: "Color",
    });
    this.blackColorFilter = this.colorFilters.locator(".swatch-option").nth(0);
    this.blackColorOnProductItem = page.locator(
      "#option-label-color-93-item-49"
    );
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

  async verifyAppliedFilters(filters) {
    const filtersCount = await this.currentFilters.count();
    for (let i = 0; i < filtersCount; i++) {
      const filterValue = await this.currentFilters.nth(i).textContent();
      expect(filterValue).toBe(filters[i]);
    }
  }

  async verifyTheSelectedColor(color) {
    const countOfColor = await color.count();
    for (let i = 0; i < countOfColor; i++) {
      await expect(color.nth(i)).toHaveAttribute('aria-checked', 'true');
    }
  }
};
