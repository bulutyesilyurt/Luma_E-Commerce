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
    this.manPants = this.manBottoms.locator(".nav-3-2-1");
    this.currentBreadcrumbs = page.locator(".breadcrumbs li");
    this.myCartIcon = page.locator(".action.showcart");
    this.myCartLoadingIcon = page.locator(".loading-mask");
    this.miniCartContent = page.locator(".block-minicart");
    this.itemCountInMiniCart = this.miniCartContent.locator(".count");
    this.itemsInMiniCart = (itemName) =>
      this.miniCartContent.locator(".product-item", { hasText: itemName });
    this.itemDetailsInMiniCart = page.locator(".toggle");
    this.itemSizeInMiniCart = page.locator(".values").nth(0);
    this.itemColorInMiniCart = page.locator(".values").nth(1);
    this.itemUnitPriceInMiniCart = page.locator(".price");
    this.itemQuantity = page.locator(".cart-item-qty");
    this.updateQuantityButton = page.locator(".update-cart-item");
    this.totalPrice = this.miniCartContent.locator(".subtotal .price");
    this.deleteIconInMiniCart = page.locator(".delete");
    this.confirmDeletionOfItem = page.locator(".action-accept");
    this.noItemInCartText = page.locator(
      "text=You have no items in your shopping cart."
    );
    this.proceedToCheckout = page.locator("#top-cart-btn-checkout");
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

  async verifyTotalItemCountInMiniCart(expectedCount) {
    const itemQuantitiesTotal = expectedCount.reduce(
      (total, quantity) => total + quantity,
      0
    );
    const actualCount = parseInt(await this.itemCountInMiniCart.textContent());
    expect(actualCount).toBe(itemQuantitiesTotal);
  }

  async verifyItemDetailsInMiniCart(
    itemName,
    itemSize,
    itemColor,
    basePrice,
    quantity
  ) {
    const itemCount = itemName.length;
    for (let i = 0; i < itemCount; i++) {
      const itemsLoop = this.itemsInMiniCart(itemName[i]);
      await itemsLoop.locator(this.itemDetailsInMiniCart).click();

      const itemSizeActual = (
        await itemsLoop.locator(this.itemSizeInMiniCart).textContent()
      )
        .trim()
        .replace(/\s+/g, " ");
      expect(itemSizeActual).toBe(itemSize[i]);

      const itemColorActual = (
        await itemsLoop.locator(this.itemColorInMiniCart).textContent()
      )
        .trim()
        .replace(/\s+/g, " ");
      expect(itemColorActual).toBe(itemColor[i]);

      const itemPriceString = await itemsLoop
        .locator(this.itemUnitPriceInMiniCart)
        .textContent();
      const itemPriceActual = parseFloat(itemPriceString.replace("$", ""));
      expect(itemPriceActual).toBe(basePrice[i]);

      const itemQuantityString = await itemsLoop
        .locator(this.itemQuantity)
        .getAttribute("data-item-qty");
      const itemQuantityActual = parseInt(itemQuantityString);
      expect(itemQuantityActual).toBe(quantity[i]);
    }
  }

  async verifyTheTotalAmount(itemUnitPrice, itemQuantities) {
    const actualAmountString = await this.totalPrice.textContent();
    const actualAmount = parseFloat(actualAmountString.replace("$", ""));

    let expectedTotal = 0;
    for (let i = 0; i < itemUnitPrice.length; i++) {
      expectedTotal += itemUnitPrice[i] * itemQuantities[i];
    }

    expect(actualAmount).toBeCloseTo(expectedTotal, 2);
  }

  async updateItemQuantityInMiniCart(itemName, quantity) {
    const itemCount = itemName.length;
    const quantityString = quantity.map(String);

    for (let i = 0; i < itemCount; i++) {
      const targetItem = this.itemsInMiniCart(itemName[i]);
      await targetItem.locator(this.itemQuantity).fill(quantityString[i]);
      await this.totalPrice.click();
      await targetItem.locator(this.updateQuantityButton).click();
      await targetItem
        .locator(this.updateQuantityButton)
        .waitFor({ state: "hidden" });
      await this.page.waitForTimeout(1000);
    }
  }

  async deleteItemsInMiniCart(itemName) {
    const itemCount = itemName.length;

    for (let i = 0; i < itemCount; i++) {
      const targetItem = this.itemsInMiniCart(itemName[i]);
      await targetItem.locator(this.deleteIconInMiniCart).click();
      await this.confirmDeletionOfItem.click();
      await this.page.waitForTimeout(1000);
    }
  }
};
