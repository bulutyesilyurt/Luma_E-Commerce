const { Login } = require("./Page Object Modal/Login");

const { chromium } = require("@playwright/test");

async function generateSession() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const login= new Login(page)

  await login.performValidLogin()

  await page.context().storageState({ path: "./loginAuth.json" });
  await browser.close();
}

export default generateSession;
