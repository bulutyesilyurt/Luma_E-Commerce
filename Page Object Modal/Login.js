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
    //This method logs in the app with the account created for the demo UI automation
    await this.page.goto(this.loginURL);
    await this.emailField.fill(process.env.USER_Email);
    await this.passwordField.fill(process.env.PASSWORD);
    await this.submitButton.click();
    await this.myAccountText.waitFor({ state: "visible" });
  }

  async performInvalidLogin() {
    //This method performs a login with invalid credentials
    await this.page.goto(this.loginURL);
    await this.emailField.fill("automationtest@playwright.com");
    await this.passwordField.fill("wrongPassword");
    await this.submitButton.click();
  }

  async loginWithFakePerson() {
    //This method performs a login with the credentials that is stored fakePerson.txt
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
    //This method retrieves the falied login message
    const message = (await this.loginErrorMessageBox.textContent())
      .replace(/\s+/g, " ")
      .trim();
    return message;
  }

  async verifyTheErrorMessage() {
    //This method validates if the failed login message is corresponding
    const errorMessage = await this.getTheLoginErrorMessage();
    expect(errorMessage).toBe(
      "The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later."
    );
  }

  async navigateToSite() {
    //This method navigates to the mainpage of the demo web app + a second of time out ensures the content loads properly and reduces test flakiness
    await this.page.goto(this.baseURL);
    await this.page.waitForTimeout(3000)
  }
};
