const { expect } = require('@playwright/test');

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
  }

  async performValidLogin() {
    await this.page.goto(
      "https://magento.softwaretestingboard.com/customer/account/login/"
    );
    await this.emailField.fill("automationtest@playwright.com");
    await this.passwordField.fill("exampletest1!");
    await this.submitButton.click();
    //await this.myAccountText.waitFor({ state: "visible" });
  }

  async performInvalidLogin() {
    await this.page.goto(
      "https://magento.softwaretestingboard.com/customer/account/login/"
    );
    await this.emailField.fill("automationtest@playwright.com");
    await this.passwordField.fill("wrongPassword");
    await this.submitButton.click();
  }

  async loginWithFakePerson(email,password){
    await this.page.goto(
      "https://magento.softwaretestingboard.com/customer/account/login/"
    );
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
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
    await this.page.goto("https://magento.softwaretestingboard.com/");
  }
};
