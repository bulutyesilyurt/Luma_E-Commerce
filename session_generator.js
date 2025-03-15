const { chromium } = require("@playwright/test");

async function generateSession() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(
    "https://magento.softwaretestingboard.com/customer/account/login/"
  );
  await page.getByTitle("Email").fill("automationtest@playwright.com");
  await page.getByTitle("Password").fill("exampletest1!");
  await page.locator(".action.login.primary").click();
  await page
    .locator(".base", { hasText: "My Account" })
    .waitFor({ state: "visible" });

  await page.context().storageState({ path: "./loginAuth.json" });
  await browser.close();
}

export default generateSession;
