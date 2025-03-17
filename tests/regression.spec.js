const { test, expect } = require("@playwright/test");
const { MyAccount } = require("../Page Object Modal/MyAccount");
const { Login } = require("../Page Object Modal/Login");
const { CreateAnAccount } = require("../Page Object Modal/CreateAnAccount");

test.describe("Example Regression Test Suite for Luma E-Commerce App", () => {
  test.beforeEach("Navigating to the website", async ({ page }) => {
    const login = new Login(page);
    await login.navigateToSite();
  });

  test("TC#1 Verify that the user is logged in with valid credentials", async ({
    page,
  }) => {
    const myAccount = new MyAccount(page);

    await page.waitForTimeout(1000);
    await myAccount.accountDropdown.click();
    await myAccount.myAccountLink.click();
    await myAccount.verifyUserDetails();
  });

  test("TC#2 Verify that the user cannot login with invalid credentials", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: "noAuth.json" });
    const page = await context.newPage();
    const login = new Login(page);

    await login.performInvalidLogin();
    await login.verifyTheErrorMessage();
    await context.close();
  });

  test("TC#3 Verify that the user can create a new account", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: "noAuth.json" });
    const page = await context.newPage();
    const login = new Login(page);
    const createAnAccount = new CreateAnAccount(page);

    await login.navigateToSite();
    await createAnAccount.createAnAccountLink.click();
    await createAnAccount.createNewAccount();
    await createAnAccount.verifyUserRegistration();
    await context.close();
  });

  test("TC#4 Verify that the user can login with the new account", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: "noAuth.json" });
    const page = await context.newPage();
    const login = new Login(page);
    const createAnAccount = new CreateAnAccount(page);
    const myAccount = new MyAccount(page);

    const fakeUser = await createAnAccount.getFakeUserDetails();
    await login.loginWithFakePerson(fakeUser.email, fakeUser.password);
    await myAccount.verifyFakeUserDetails(
      fakeUser.firstName,
      fakeUser.lastName,
      fakeUser.email
    );
    await context.close();
  });

  test("TC#5 Verify that the can perform a log out", async ({ browser }) => {
    const context1 = await browser.newContext({
      storageState: "./loginAuth.json",
    });
    const page1 = await context1.newPage();
    const login = new Login(page1);
    const myAccount = new MyAccount(page1);

    await login.navigateToSite();
    await page1.waitForTimeout(1000);
    await myAccount.accountDropdown.click();
    await myAccount.signOutLink.click();
    await myAccount.verifySigningOut();
    await context1.close();

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const newLogin = new Login(page2);
    await newLogin.performValidLogin();
    await context2.storageState({ path: "./loginAuth.json" }); //Performing a re-login to keep the session alive
    await context2.close();
  });

});
