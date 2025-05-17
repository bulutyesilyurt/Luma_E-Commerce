const { expect } = require("@playwright/test");
const fs = require("fs");

exports.CheckOutPage = class CheckOutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.selectedAdress = page.locator(".shipping-address-item.selected-item");
    this.companyInputField = page.locator('input[name="company"]');
    this.streetAdressInputField = page.locator('input[name="street[0]"]');
    this.cityInputField = page.locator('input[name="city"]');
    this.stateDropdown = page.locator('select[name="region_id"]');
    this.postalCodeInputField = page.locator('input[name="postcode"]');
    this.phoneNumberInputField = page.locator('input[name="telephone"]');
    this.basicShippingOption = page.locator(".radio").first();
    this.nextButton = page.locator(".button", { hasText: "Next" });
    this.orderSummaryBlock = page.locator(".opc-block-summary");
    this.loaderInOrderSummary = this.orderSummaryBlock.locator(".loader");
    this.expandItemsInSummaryBlock = page.locator(".items-in-cart");
    this.itemsInSummaryBlock = (itemName) =>
      page.locator(".product-item-details", { hasText: itemName });
    this.itemDetailsInSummaryBlock = page.locator(".toggle");
    this.itemSizeInSummaryBlock = page.locator(".values").first();
    this.itemColorInSummaryBlock = page.locator(".values").nth(1);
    this.itemUnitPriceInSummaryBlock = page.locator(".price");
    this.itemQuantityinSummaryBlock = page.locator(".value");
    this.totalItemCountInSummaryBlock = page
      .locator(".items-in-cart span")
      .first();
    this.totalPriceInSummaryBlock = page.locator(".grand .price");
    this.shippingCostValue = page.locator(".shipping .amount");
    this.shippingDetails = page
      .locator(".shipping-information-content")
      .first();
    this.placeAnOrderButton = page.locator(".primary .checkout");
    this.orderConfirmationTitle = page.locator(".page-title");
    this.orderNumber = page.locator(".order-number");
  }

  async fillDeliveryAdress() {
    //This function fill the input fields with the following hardcoded values if there is no saved adress when ordering
    await this.companyInputField.fill("test");
    await this.streetAdressInputField.fill("test");
    await this.cityInputField.fill("test");
    await this.stateDropdown.selectOption("1");
    await this.postalCodeInputField.fill("12345");
    await this.phoneNumberInputField.fill("12345");
  }

  async verifyTotalItemCountInSummaryBlock(expectedCount) {
    //This functions compares the total count of items coming from the website to calculated total amount with test data
    const itemQuantitiesTotal = expectedCount.reduce(
      (total, quantity) => total + quantity,
      0
    );
    const actualCount = parseInt(
      await this.totalItemCountInSummaryBlock.textContent()
    );
    expect(actualCount).toBe(itemQuantitiesTotal);
  }

  async verifyItemDetailsInSummaryBlock(
    //This method checks if the corresponding items details are displayed in the summary page when ordering (compares the test data with the data coming from the website)
    itemName,
    itemSize,
    itemColor,
    basePrice,
    quantity
  ) {
    const itemCount = itemName.length;
    for (let i = 0; i < itemCount; i++) {
      const itemsloop = this.itemsInSummaryBlock(itemName[i]);
      await itemsloop.locator(this.itemDetailsInSummaryBlock).click();

      const itemSizeActual = (
        await itemsloop.locator(this.itemSizeInSummaryBlock).textContent()
      )
        .trim()
        .replace(/\s+/g, " ");
      expect(itemSizeActual).toBe(itemSize[i]);

      const itemColorActual = (
        await itemsloop.locator(this.itemColorInSummaryBlock).textContent()
      )
        .trim()
        .replace(/\s+/g, " ");
      expect(itemColorActual).toBe(itemColor[i]);

      const itemQuantityString = await itemsloop
        .locator(this.itemQuantityinSummaryBlock)
        .textContent();
      const itemQuantityActual = parseInt(itemQuantityString);
      expect(itemQuantityActual).toBe(quantity[i]);

      const itemPriceString = await itemsloop
        .locator(this.itemUnitPriceInSummaryBlock)
        .textContent();
      const itemPriceActual = parseFloat(itemPriceString.replace("$", ""));
      expect(itemPriceActual).toBe(basePrice[i] * quantity[i]);
    }
  }

  async verifyTheTotalAmount(itemUnitPrice, itemQuantities) {
    //This method verifies the total amount is shown corrertly in the order page based on item base price, item quantities + shipping cost(which is 0 for this test framework)
    const shippingCostString = await this.shippingCostValue.textContent();
    const shippingCost = parseFloat(shippingCostString.replace("$", ""));
    const actualAmountString =
      await this.totalPriceInSummaryBlock.textContent();
    const actualAmount = parseFloat(actualAmountString.replace("$", ""));

    let expectedTotal = 0 + shippingCost;
    for (let i = 0; i < itemUnitPrice.length; i++) {
      expectedTotal += itemUnitPrice[i] * itemQuantities[i];
    }

    expect(actualAmount).toBeCloseTo(expectedTotal, 2);
  }

  async verifyShippingDetails() {
    //This method verifies the shown shipping adress is matching with hardcoded adress
    const shippingDetails = (await this.shippingDetails.innerText())
      .split("\n")
      .join(" ");
    expect(shippingDetails).toBe(
      `${process.env.User_Name} ${process.env.User_Surname} test test, Alabama 12345 United States 12345 `
    );
  }

  async saveOrderNumber() {
    const orderNumber = await this.orderNumber.textContent();
    const dir = "order_number/orderNumber.txt";
    fs.writeFileSync(dir, orderNumber);
  }
};
