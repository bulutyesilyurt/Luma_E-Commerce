const { expect } = require("@playwright/test");
const fs = require("fs");
exports.Login = class Login {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailField = page.getByTitle("Email");
    this.passwordField = page.getByTitle("Password");
    this.submitButton = page.locator(".action.login.primary");
    this.myAccountText = page.locator(".base", { hasText: "My Account" });
    this.loginErrorMessageBox = page.locator('[data-ui-id="message-error"]');
    this.loginURL =
      "https://magento.softwaretestingboard.com/customer/account/login/";
    this.baseURL = "https://magento.softwaretestingboard.com/";
  }

  async performValidLogin() {
    await this.page.goto(this.loginURL);
    await this.emailField.fill("automationtest@playwright.com");
    await this.passwordField.fill("exampletest1!");
    await this.submitButton.click();
    await this.myAccountText.waitFor({ state: "visible" });
  }

  async performInvalidLogin() {
    await this.page.goto(this.loginURL);
    await this.emailField.fill("automationtest@playwright.com");
    await this.passwordField.fill("wrongPassword");
    await this.submitButton.click();
  }

  async loginWithFakePerson() {
    const fakeUser = JSON.parse(
      fs.readFileSync("fake_people_testData/fakePerson.txt", "utf-8")
    );
    await this.page.goto(this.loginURL);
    await this.emailField.fill(fakeUser.email);
    await this.passwordField.fill(fakeUser.password);
    await this.submitButton.click();
    await this.myAccountText.waitFor({ state: "visible" });
  }

  async getTheLoginErrorMessage() {
    const message = (await this.loginErrorMessageBox.textContent())
      .replace(/\s+/g, " ")
      .trim();
    return message;
  }

  async verifyTheErrorMessage() {
    const errorMessage = await this.getTheLoginErrorMessage();
    expect(errorMessage).toBe(
      "The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later."
    );
  }

  async navigateToSite() {
    await this.page.goto(this.baseURL);
    //await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000)
  }
};
