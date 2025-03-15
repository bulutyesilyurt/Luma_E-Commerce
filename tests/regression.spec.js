const { test, expect } = require("@playwright/test");

test.describe("Example Regression Test Suite for Luma E-Commerce App", () => {
  test("TC#1 Verify that the user can execute a login with valid credentials", async ({
    page,
  }) => {
    await page.goto("https://magento.softwaretestingboard.com/"); //Since a valid login is performend in "session_generator.js" file we are utilizing the stored session and directly navigating to the user account.
    await page.locator(".authorization-link").first().click();
    const userInfo = (
      await page.locator(".box-information .box-content p").textContent()
    )
      .replace(/\s+/g, " ")
      .trim();
    expect(userInfo).toContain("example test automationtest@playwright.com");
  });
});
