exports.My_account = class My_account {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.myAccountPage = page.locator(".authorization-link").first();
    this.userInfo = page.locator(".box-information .box-content p");
  }

  async getUserInfo() {
    const userDetailsPlainText = (await this.userInfo.textContent())
      .replace(/\s+/g, " ")
      .trim();
    return userDetailsPlainText;
  }
};
