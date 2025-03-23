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
  }

  async getUserInfo() {
    //This method retursn the username and email in my account section
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

  async verifySigningOut() {
    //This method verifies that after siging out is completed properly and the corresponding message is displayed
    expect(this.signedOutMessage).toBeVisible();
    const actualMessage = await this.signedOutMessage.textContent();
    expect(actualMessage).toBe("You are signed out");
  }
};
