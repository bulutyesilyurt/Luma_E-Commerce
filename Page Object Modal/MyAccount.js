const { expect } = require("@playwright/test");
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
  }

  async getUserInfo() {
    const userDetailsPlainText = (await this.userInfo.textContent())
      .replace(/\s+/g, " ")
      .trim();
    return userDetailsPlainText;
  }

  async verifyUserDetails() {
    const userInfo = await this.getUserInfo();
    expect(userInfo).toBe("example test automationtest@playwright.com");
  }

  async verifyFakeUserDetails(name, surname, email) {
    const userInfo = await this.getUserInfo();
    expect(userInfo).toBe(`${name} ${surname} ${email}`);
    console.log(
      `The user verification information - Account details in webpage: ${userInfo}`
    );
  }

  async verifySigningOut() {
    expect(this.signedOutMessage).toBeVisible()
    const actualMessage = await this.signedOutMessage.textContent()
    expect(actualMessage).toBe("You are signed out")
  }
};
