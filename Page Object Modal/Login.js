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
    await this.myAccountText.waitFor({ state: "visible" });
  }

  async performInvalidLogin() {
    await this.page.goto(
      "https://magento.softwaretestingboard.com/customer/account/login/"
    );
    await this.emailField.fill("automationtest@playwright.com");
    await this.passwordField.fill("wrongPassword");
    await this.submitButton.click();
  }

  async getTheLoginErrorMessage() {
    const message = (await this.loginErrorMessageBox.textContent())
      .replace(/\s+/g, " ")
      .trim();
    return message;
  }

  async navigateToSite() {
    await this.page.goto("https://magento.softwaretestingboard.com/"); //Since a login is performend in "session_generator.js" file we are utilizing the stored session and directly navigating to the user account.
  }
};
