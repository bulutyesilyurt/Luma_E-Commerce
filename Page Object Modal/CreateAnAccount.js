const { faker } = require("@faker-js/faker");
const { expect } = require("@playwright/test");
const fs = require("fs");
const { MyAccount } = require("./MyAccount");

exports.CreateAnAccount = class CreateAnAccount {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.myAccount = new MyAccount(page);
    this.createAnAccountLink = page
      .locator("a", { hasText: "Create an Account" })
      .first();
    this.firstNameField = page.locator("#firstname");
    this.lastNameField = page.locator("#lastname");
    this.emailField = page.locator("#email_address");
    this.emailField = page.locator("#email_address");
    this.passwordField = page.locator("#password");
    this.confirmPassWordField = page.locator("#password-confirmation");
    this.submitButton = page.getByTitle("Create an Account");
    this.registeredMessage = page
      .locator(
        '[data-bind="html: $parent.prepareMessageForHtml(message.text)"]'
      )
      .first();
    this.userDir = "fake_people_testData/fakePerson.txt";
  }

  async createNewAccount() {
    const fakeUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    fs.writeFileSync(this.userDir, JSON.stringify(fakeUser, null, 2));

    await this.firstNameField.fill(fakeUser.firstName);
    await this.lastNameField.fill(fakeUser.lastName);
    await this.emailField.fill(fakeUser.email);
    await this.passwordField.fill(fakeUser.password);
    await this.confirmPassWordField.fill(fakeUser.password);

    await this.submitButton.click();
  }

  async getFakeUserDetails() {
    const fakeUser = fs.readFileSync(this.userDir, "utf-8");
    return JSON.parse(fakeUser);
  }

  async verifyUserRegistration() {
    await this.registeredMessage.waitFor({ state: "visible" });
    const message = await this.registeredMessage.textContent();
    expect(message).toBe("Thank you for registering with Main Website Store.");

    const userInfo = await this.myAccount.getUserInfo();
    const fakeUser = await this.getFakeUserDetails();
    expect(userInfo).toBe(
      `${fakeUser.firstName} ${fakeUser.lastName} ${fakeUser.email}`
    );
    console.log(`Previously created fake user credentials: ${JSON.stringify(fakeUser, null, 2)}`);
  }
};
