const { expect } = require("@playwright/test");
const fs = require("fs");
exports.MyAccount = class MyAccount {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.accountDropdown = page.locator(".action.switch").first();
    this.myAccountLink = page.locator("a", { hasText: "My Account" }).first();
    this.userInfo = page.locator(".box-information .box-content p");
    this.signOutLink = page
      .locator("a", { hasText: "         Sign Out    " })
      .first();
    this.signedOutMessage = page.locator(".base", {
      hasText: "You are signed out",
    });
    this.myAccountNavMenu = page.locator(".nav.items");
    this.myOrders = this.myAccountNavMenu.locator("a", {
      hasText: "My Orders",
    });
    this.ordersTable = page.locator(".table-order-items");
    this.lastOrderDetails = (orderID) =>
      this.ordersTable
        .locator("tr", { hasText: orderID })
        .locator("a", { hasText: "View Order" });
    this.orderDetailsTable = page.locator(".table-order-items");
    this.itemRowsInOrdersTable = this.orderDetailsTable.locator("tbody");
    this.itemRow = (itemName) =>
      this.orderDetailsTable.locator("tbody", {
        has: page.locator(".product-item-name", { hasText: itemName }),
      });
    this.itemSizeInOrderHistory = page.locator(".item-options dd").first();
    this.itemColorInOrderHistory = page.locator(".item-options dd").nth(1);
    this.itemUnitPriceInOrderHistory = page.locator(".col.price .cart-price");
    this.itemQuantityInOrderHistory = page.locator(".content");
    this.shippingCostValue = page.locator(".shipping .price");
    this.grandTotal = page.locator(".grand_total .price");
  }

  async getUserInfo() {
    //This method returns the username and email in my account section
    const userDetailsPlainText = (await this.userInfo.textContent())
      .replace(/\s+/g, " ")
      .trim();
    return userDetailsPlainText;
  }

  async verifyUserDetails() {
    //This method verifies that the username and email which is shown in my account is matching with what it actually is
    const userInfo = await this.getUserInfo();
    expect(userInfo).toBe("example test automationtest@playwright.com");
  }

  async verifyFakeUserDetails() {
    //This method verifies the username and email of the kafe person in the my account section that if it's shown correspondingly or not
    const userInfo = await this.getUserInfo();
    const fakeUser = JSON.parse(
      fs.readFileSync("fake_people_testData/fakePerson.txt", "utf-8")
    );
    expect(userInfo).toBe(
      `${fakeUser.firstName} ${fakeUser.lastName} ${fakeUser.email}`
    );
    console.log(
      `The user verification information - Account details in webpage: ${userInfo}`
    );
  }

  async getLastOrderID() {
    //This method retieves the lastest orderID from order_number folder
    const lastORderID = fs.readFileSync(
      "order_number/orderNumber.txt",
      "utf-8"
    );
    return lastORderID;
  }

  async goToLastOrder() {
    //This method clicks on view order details of the latest order
    const lastOrderID = await this.getLastOrderID();
    await this.lastOrderDetails(lastOrderID).click();
    await this.page.waitForLoadState("networkidle");
  }

  async verifySigningOut() {
    //This method verifies that after siging out is completed properly and the corresponding message is displayed
    expect(this.signedOutMessage).toBeVisible();
    const actualMessage = await this.signedOutMessage.textContent();
    expect(actualMessage).toBe("You are signed out");
  }

  async verifyCountOfItemRows(itemNames) {
    //This method verifies that there is corresponding amount of item registries in the order history
    const countOfItems = await itemNames.length;
    const countOfItemsInRows = await this.itemRowsInOrdersTable.count();
    expect(countOfItemsInRows).toBe(countOfItems);
  }

  async verifyAllItemDetailsInOrderHistory(
    //This method verifies that all item details can be found correspondingly in the order history
    itemName,
    itemSize,
    itemColor,
    basePrice,
    quantity
  ) {
    const itemCount = itemName.length;
    for (let i = 0; i < itemCount; i++) {
      const itemsLoop = this.itemRow(itemName[i]);

      const itemSizeActual = (
        await itemsLoop.locator(this.itemSizeInOrderHistory).textContent()
      )
        .trim()
        .replace(/\s+/g, " ");
      expect(itemSizeActual).toBe(itemSize[i]);

      const itemColorActual = (
        await itemsLoop.locator(this.itemColorInOrderHistory).textContent()
      )
        .trim()
        .replace(/\s+/g, " ");
      expect(itemColorActual).toBe(itemColor[i]);

      const itemPriceString = await itemsLoop
        .locator(this.itemUnitPriceInOrderHistory)
        .textContent();
      const itemPriceActual = parseFloat(itemPriceString.replace("$", ""));
      expect(itemPriceActual).toBe(basePrice[i]);

      const itemQuantityString = (
        await itemsLoop.locator(this.itemQuantityInOrderHistory).textContent()
      ).replace(/\s+/g, " ");
      const itemQuantityActual = parseInt(itemQuantityString);
      expect(itemQuantityActual).toBe(quantity[i]);
    }
  }

  async verifyTheTotalAmount(itemUnitPrice, itemQuantities) {
    //This method verifies the grand subtotal is as expected based on shipping cost + item base prices and quantities
    const shippingCostString = await this.shippingCostValue.textContent();
    const shippingCost = parseFloat(shippingCostString.replace("$", ""));
    const actualAmountString = await this.grandTotal.textContent();
    const actualAmount = parseFloat(actualAmountString.replace("$", ""));

    let expectedTotal = 0 + shippingCost;
    for (let i = 0; i < itemUnitPrice.length; i++) {
      expectedTotal += itemUnitPrice[i] * itemQuantities[i];
    }

    expect(actualAmount).toBeCloseTo(expectedTotal, 2);
  }
};
