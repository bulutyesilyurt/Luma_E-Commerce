const { test, expect } = require("@playwright/test");
const { MyAccount } = require("../Page Object Modal/MyAccount");
const { Login } = require("../Page Object Modal/Login");
const { CreateAnAccount } = require("../Page Object Modal/CreateAnAccount");
const {
  HeaderAndNavSection,
} = require("../Page Object Modal/HeaderAndNavSection");
const { MainPage } = require("../Page Object Modal/MainPage");
const { CheckOutPage } = require("../Page Object Modal/CheckOutPage");

const itemNames = ["Montana Wind Jacket", "Jupiter All-Weather Trainer"];
const itemSizes = ["M", "L"];
const itemColors = ["Black", "Blue"];
const itemBasePrices = [49.0, 56.99];
let itemQuantities;

test.describe("Example Regression Test Suite for Luma E-Commerce App", () => {
  test.beforeEach("Navigating to the website", async ({ page }) => {
    const login = new Login(page);
    await login.navigateToSite();
    itemQuantities = [1, 1];
  });

  test("TC#1 Verify that the user details are shown correspondingly to actual user details", async ({
    page,
  }) => {
    const myAccount = new MyAccount(page);

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
    const myAccount = new MyAccount(page);

    await login.loginWithFakePerson();
    await myAccount.verifyFakeUserDetails();
    await context.close();
  });

  test("TC#5 Verify that the user can perform a log out", async ({
    browser,
  }) => {
    const context1 = await browser.newContext({
      storageState: "./loginAuth.json",
    });
    const page1 = await context1.newPage();
    const login = new Login(page1);
    const myAccount = new MyAccount(page1);

    await login.navigateToSite();
    await myAccount.accountDropdown.click();
    await myAccount.signOutLink.click();
    await page1.waitForLoadState("networkidle");
    await myAccount.verifySigningOut();
    await context1.close();

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const newLogin = new Login(page2);
    await newLogin.performValidLogin();
    await context2.storageState({ path: "./loginAuth.json" }); //Performing a re-login to keep the session alive
    await context2.close();
  });

  test("TC#6 Verify that user can search and display a product", async ({
    page,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);
    const mainPage = new MainPage(page);

    const item = "Jupiter";
    const itemName = ["Jupiter All-Weather Trainer"];
    const itemPrice = ["$56.99"];

    await headerAndNavSection.searchAnItem(item);
    await mainPage.verifySearchInput(item);
    await mainPage.verifyDisplayedItemCount(1);
    await mainPage.verifyItemName(itemName);
    await mainPage.verifyItemPrice(itemPrice);
  });

  test("TC#7 Verify that user can search and display multiple products", async ({
    page,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);
    const mainPage = new MainPage(page);

    const item = "Lightweight";
    const itemName = [
      "Marco Lightweight Active Hoodie",
      "Cronus Yoga Pant",
      "Aether Gym Pant",
      "Artemis Running Short",
      "Breathe-Easy Tank",
      "Antonia Racer Tank",
      "Lucia Cross-Fit Bra",
      "Prima Compete Bra Top",
      "Desiree Fitness Tee",
      "Gwyn Endurance Tee",
      "Diva Gym Tee",
      "Minerva LumaTech™ V-Tee",
    ];
    const itemPrice = [
      "$74.00",
      "$38.40",
      "$59.20",
      "$45.00",
      "$34.00",
      "$34.00",
      "$39.00",
      "$24.00",
      "$24.00",
      "$24.00",
      "$32.00",
      "$32.00",
    ];

    await headerAndNavSection.searchAnItem(item);
    await mainPage.verifySearchInput(item);
    await mainPage.verifyDisplayedItemCount(12);
    await mainPage.verifyItemName(itemName);
    await mainPage.verifyItemPrice(itemPrice);
  });

  test("TC#8 Verify that the user can perform navigation by using the nav component and breadcrumbs are updated correspondingly", async ({
    page,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);

    await headerAndNavSection.manCategory.hover();
    await headerAndNavSection.manTops.hover();
    await headerAndNavSection.manJackets.click();

    const breadCrumbs = ["Home", "Men", "Tops", "Jackets"];
    await headerAndNavSection.validateBreadCrumbs(breadCrumbs);
  });

  test("TC#9 Verify that the user can filter the results by using the filter section", async ({
    page,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);
    const mainPage = new MainPage(page);

    await headerAndNavSection.manCategory.hover();
    await headerAndNavSection.manBottoms.hover();
    await headerAndNavSection.manPants.click();
    await page.waitForLoadState("networkidle");

    await mainPage.styleFilters.click();
    await mainPage.baseLayer.click();
    await page.waitForLoadState("networkidle");
    await mainPage.colorFilters.click();
    await mainPage.blackColorFilter.click();
    await page.waitForLoadState("networkidle");

    const currentFilterValues = ["Base Layer", "Black"];
    await mainPage.verifyAppliedFilters(currentFilterValues);

    await mainPage.verifyTheSelectedColor(mainPage.blackColorOnProductItem);
    await mainPage.verifyDisplayedItemCount(2);

    const itemName = ["Livingston All-Purpose Tight", "Kratos Gym Pant"];
    const itemPrice = ["$60.00", "$45.60"];
    await mainPage.verifyItemName(itemName);
    await mainPage.verifyItemPrice(itemPrice);
  });

  test("TC#10 Verify that the user can remove the all of the applied filters with clear all button", async ({
    page,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);
    const mainPage = new MainPage(page);

    await headerAndNavSection.manCategory.hover();
    await headerAndNavSection.manBottoms.hover();
    await headerAndNavSection.manPants.click();
    await page.waitForLoadState("networkidle");

    await mainPage.styleFilters.click();
    await mainPage.baseLayer.click();
    await page.waitForLoadState("networkidle");
    await mainPage.colorFilters.click();
    await mainPage.blackColorFilter.click();
    await page.waitForLoadState("networkidle");

    await mainPage.clearAllFiltersButton.click();
    await page.waitForLoadState("networkidle");
    await mainPage.verifyNoFiltersApplied();
    await mainPage.verifyDisplayedItemCount(12);
    await mainPage.verifyTheUnselectedColor(mainPage.blackColorOnProductItem);
  });

  test("TC#11 Verify that the user can remove filters individually", async ({
    page,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);
    const mainPage = new MainPage(page);

    await headerAndNavSection.manCategory.hover();
    await headerAndNavSection.manBottoms.hover();
    await headerAndNavSection.manPants.click();
    await page.waitForLoadState("networkidle");

    await mainPage.styleFilters.click();
    await mainPage.baseLayer.click();
    await page.waitForLoadState("networkidle");
    await mainPage.colorFilters.click();
    await mainPage.blackColorFilter.click();
    await page.waitForLoadState("networkidle");

    const currentFilterValues = ["Base Layer", "Black"];
    await mainPage.removeAFilter(currentFilterValues[0]);
    await page.waitForLoadState("networkidle");
    await mainPage.verifyTheRemovedFilter(currentFilterValues[0]);
    await mainPage.verifyDisplayedItemCount(7);

    await mainPage.removeAFilter(currentFilterValues[1]);
    await page.waitForLoadState("networkidle");
    await mainPage.verifyTheRemovedFilter(currentFilterValues[1]);
    await mainPage.verifyTheUnselectedColor(mainPage.blackColorOnProductItem);
    await mainPage.verifyDisplayedItemCount(12);
  });

  test("TC#12 Verify that the user can add products to the cart", async ({
    page,
    context,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);
    const mainPage = new MainPage(page);

    await headerAndNavSection.manCategory.hover();
    await headerAndNavSection.manTops.hover();
    await headerAndNavSection.manJackets.click();
    await page.waitForLoadState("networkidle");

    await mainPage.addItemToCart(itemNames, itemSizes, itemColors);
    await headerAndNavSection.myCartLoadingIcon.waitFor({ state: "hidden" });
    await headerAndNavSection.myCartIcon.click();
    await headerAndNavSection.verifyTotalItemCountInMiniCart(itemQuantities);
    await headerAndNavSection.verifyItemDetailsInMiniCart(
      itemNames,
      itemSizes,
      itemColors,
      itemBasePrices,
      itemQuantities
    );

    await headerAndNavSection.verifyTheTotalAmount(
      itemBasePrices,
      itemQuantities
    );

    await context.storageState({ path: "./loginAuth.json" });
  });

  test("TC#13 Verify that the user can edit quantity in the cart", async ({
    page,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);

    await headerAndNavSection.myCartIcon.click();
    await headerAndNavSection.verifyTotalItemCountInMiniCart(itemQuantities);
    await headerAndNavSection.verifyTheTotalAmount(
      itemBasePrices,
      itemQuantities
    );

    itemQuantities = [2, 3];
    await headerAndNavSection.updateItemQuantityInMiniCart(
      itemNames,
      itemQuantities
    );

    await headerAndNavSection.verifyTheTotalAmount(
      itemBasePrices,
      itemQuantities
    );

    await headerAndNavSection.verifyTotalItemCountInMiniCart(itemQuantities);
  });

  test("TC#14 Verify that the user can remove all items in the cart", async ({
    page,
    context,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);

    await headerAndNavSection.myCartIcon.click();
    await headerAndNavSection.deleteItemsInMiniCart(itemNames);
    await expect(headerAndNavSection.noItemInCartText).toBeVisible();
    await expect(headerAndNavSection.totalPrice).toBeHidden();
    await expect(headerAndNavSection.itemCountInMiniCart).toBeHidden();
    await context.storageState({ path: "./loginAuth.json" });
  });

  test("TC#15 Verify that the user can place an order succesfully", async ({
    page,
  }) => {
    const headerAndNavSection = new HeaderAndNavSection(page);
    const mainPage = new MainPage(page);
    const checkOutPage = new CheckOutPage(page);

    await headerAndNavSection.manCategory.hover();
    await headerAndNavSection.manTops.hover();
    await headerAndNavSection.manJackets.click();
    await page.waitForLoadState("networkidle");

    await mainPage.addItemToCart(itemNames, itemSizes, itemColors);
    await headerAndNavSection.myCartLoadingIcon.waitFor({ state: "hidden" });
    await headerAndNavSection.myCartIcon.click();
    await headerAndNavSection.proceedToCheckout.click();

    await page.waitForLoadState("networkidle");
    if (await checkOutPage.selectedAdress.isVisible()) {
      await checkOutPage.basicShippingOption.check();
      await checkOutPage.nextButton.click();
    } else {
      await checkOutPage.fillDeliveryAdress();
      await checkOutPage.basicShippingOption.check();
      await checkOutPage.nextButton.click();
    }

    await checkOutPage.shippingDetails.waitFor({ state: "visible" });
    await checkOutPage.loaderInOrderSummary.waitFor({ state: "hidden" });
    await checkOutPage.verifyTotalItemCountInSummaryBlock(itemQuantities);
    await checkOutPage.verifyTheTotalAmount(itemBasePrices, itemQuantities);
    await checkOutPage.expandItemsInSummaryBlock.click();
    await checkOutPage.verifyItemDetailsInSummaryBlock(
      itemNames,
      itemSizes,
      itemColors,
      itemBasePrices,
      itemQuantities
    );
    await checkOutPage.verifyShippingDetails();
    await checkOutPage.placeAnOrderButton.click();
    await checkOutPage.orderConfirmationTitle.waitFor({ state: "visible" });
    await checkOutPage.saveOrderNumber();
  });

  test("TC#16 Verify that previously placed order content is corresponding to what was ordered", async ({
    page,
  }) => {
    const myAccount = new MyAccount(page);

    await myAccount.accountDropdown.click();
    await myAccount.myAccountLink.click();
    await myAccount.myOrders.click();
    await page.waitForLoadState("networkidle");
    await myAccount.goToLastOrder();
    await myAccount.verifyCountOfItemRows(itemNames);
    await myAccount.verifyAllItemDetailsInOrderHistory(
      itemNames,
      itemSizes,
      itemColors,
      itemBasePrices,
      itemQuantities
    );
    await myAccount.verifyTheTotalAmount(itemBasePrices, itemQuantities);
  });
});
