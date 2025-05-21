const { expect } = require("@playwright/test");

exports.MainPage = class MainPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.searchResultsText = page.locator(".base");
    this.productItem = page.locator(".list.product-items .product-item");
    this.productItemName = (i) =>
      this.productItem.nth(i).locator(".product-item-link");
    this.productItemPrice = (i) => this.productItem.nth(i).locator(".price");
    this.searchResults = page.locator(".results");
    this.currentFilters = page.locator(".filter-current .filter-value");
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
    this.productSizeSelector = (size) =>
      page.locator(".swatch-option", { has: page.locator(`text="${size}"`) });
    this.productColorSelector = (color) =>
      page.locator(`[option-label="${color}"]`);
    this.clearAllFiltersButton = page.locator(".filter-clear");
    this.removeFilterButton = (filterValue) =>
      page.locator(".filter-current li", { hasText: filterValue }).locator("a");
    this.filterRow = (filterValue) =>
      page.locator(".filter-current li", { hasText: filterValue });
    this.addToCartButton = page.locator(".action.tocart.primary");
  }

  async verifySearchInput(searchedItem) {
    //This method verifies that after performing a search, the search result value is displayed correspondingly
    const searchItem = searchedItem;
    const itemNameDisplayed = await this.searchResultsText.textContent();

    expect(itemNameDisplayed).toBe(`Search results for: '${searchItem}'`);
  }

  async verifyDisplayedItemCount(expectedCount) {
    //This method verifies that there are expected amount of products items are shown in the current page
    const actualCount = await this.productItem.count();
    expect(actualCount).toBe(expectedCount);
  }

  async verifyItemName(itemName) {
    //This method verifies that displayed items have the expected names in the current page
    const itemCount = await this.productItem.count();

    for (let i = 0; i < itemCount; i++) {
      const listedItemNames = (
        await this.productItemName(i).textContent()
      ).trim();
      expect(listedItemNames).toBe(itemName[i]);
    }
  }

  async verifyItemPrice(itemPrice) {
    //This method verifies that displayed items have the expected prices in the current page
    const itemCount = await this.productItem.count();

    for (let i = 0; i < itemCount; i++) {
      const listedItemPrices = (
        await this.productItemPrice(i).textContent()
      ).trim();
      expect(listedItemPrices).toBe(itemPrice[i]);
    }
  }

  async verifyAppliedFilters(filters) {
    //This method verifies that after appyling certain filters, those are displayed in the filters section correspondingly
    const filtersCount = await this.currentFilters.count();
    for (let i = 0; i < filtersCount; i++) {
      const filterValue = await this.currentFilters.nth(i).textContent();
      expect(filterValue).toBe(filters[i]);
    }
  }

  async verifyTheSelectedColor(color) {
    //This method verifies that after selecting a color filter, that color is applied on all of the displayed product items in the current page
    const countOfColor = await color.count();
    for (let i = 0; i < countOfColor; i++) {
      await expect(await color.nth(i)).toHaveAttribute("aria-checked", "true");
    }
  }

  async verifyTheUnselectedColor(color) {
    //This method verifies that after DESELECTING a color filter, the color is not applied on any of the displayed product items in the current page
    const countOfColor = await color.count();
    for (let i = 0; i < countOfColor; i++) {
      await expect(await color.nth(i)).toHaveAttribute("aria-checked", "false");
    }
  }

  async verifyNoFiltersApplied() {
    //This method verifies that after removing all of the filters, there is no filter option is displayed in the filter section and the filter section is not visible anymore
    await expect(this.currentFilters).toBeHidden();
    await expect(this.currentFilters).toHaveCount(0);
  }

  async removeAFilter(filterValue) {
    //This method removes all of the applied filters by clicking clear all button
    await this.removeFilterButton(filterValue).click();
  }

  async verifyTheRemovedFilter(filterValue) {
    //This method verifies that after certain filter value is removed individually, it is not visible anymore inside the filter section
    const filterRow = this.filterRow(filterValue);
    await expect(filterRow).toBeHidden();
  }

  async addItemToCart(itemName, size, color) {
    //This method adds an item with desired size and color to the basket (works for single or multiple items)
    const countOfProducts = await itemName.length;
    for (let k = 0; k < countOfProducts; k++) {
      const countOfItems = await this.productItem.count();
      for (let i = 0; i < countOfItems; i++) {
        const itemNameOnThePage = (
          await this.productItemName(i).textContent()
        ).trim();
        if (itemNameOnThePage === itemName[k]) {
          await this.productItem
            .nth(i)
            .locator(this.productSizeSelector(size[k]))
            .click();
          await this.page.waitForLoadState("networkidle");
          await this.productItem
            .nth(i)
            .locator(this.productColorSelector(color[k]))
            .click();
          await this.page.waitForLoadState("networkidle");
          await this.productItem.nth(i).locator(this.addToCartButton).click();
          await this.page.waitForLoadState("networkidle");
          break;
        }
      }
    }
  }
};
