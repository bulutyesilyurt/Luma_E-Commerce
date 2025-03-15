const { test, expect } = require("@playwright/test");
const { My_account } = require("../Page Object Modal/My_account");
const { Login } = require("../Page Object Modal/Login");

test.describe("Example Regression Test Suite for Luma E-Commerce App", () => {
  test.beforeEach("Navigating to the website", async ({ page }) => {
    if (skipBeforeEach) return;
    const login = new Login(page);
    await login.navigateToSite();
  });

  test("TC#1 Verify that the user is logged in with valid credentials", async ({
    page,
  }) => {
    const my_account = new My_account(page);

    await my_account.myAccountPage.click();
    const userInfo = await my_account.getUserInfo();
    expect(userInfo).toBe("example test automationtest@playwright.com");
  });

  test("TC#2 Verify that the user cannot login with invalid credentials", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: "noAuth.json" });
    const page = await context.newPage();
    const login = new Login(page);

    await login.performInvalidLogin();
    const errorMessage = await login.getTheLoginErrorMessage();
    expect(errorMessage).toBe(
      "The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later."
    );
  });

});
