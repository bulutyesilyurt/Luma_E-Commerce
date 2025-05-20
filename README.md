This project contains a demo UI automation tests for the Luma E-Commerce demo site, built using Playwright and JavaScript. It follows the Page Object Model (POM) design pattern for better maintainability and readability.

Luma_E-Commerce/
├── tests/ # Test scenarios
├── Page Object Modal/ # Page Object Model classes
├── fake_people_testData/ # Fake user credentials is stored here for test data purposes
├── order_Number/ # An order number is stored here for test data purposes
├── session_generator.js # A custom function for session and login helper
├── playwright.config.js # Playwright configuration
├── .env # Environment variables
├── package.json # Project dependencies
└── README.md # Project documentation

Technologies Used
Playwright

JavaScript (Node.js)

dotenv

Getting Started

1. Clone the repository
   git clone https://github.com/bulutyesilyurt/Luma_E-Commerce.git
   cd Luma_E-Commerce

2. Install dependencies
   npm install

3. Configure environment variables
   Create a user account in https://magento.softwaretestingboard.com/ and create a .env file in the root directory and provide any required environment-specific variables with user information.

playwrigth.config.js
A global setup has been defined in the config file in order to perform a one time login prior to test execution to prevent the necessity of performing login on each test case. The custom function can be found in session_generator.js file. The storage state is saved into loginAuth.json. This project only set to use Google Chrome browser with following settings and:
{
...devices["Desktop Chrome"],
viewport: { width: 2520, height: 1280 },
channel: "chrome",
screenshot: "only-on-failure",
video: "retain-on-failure",
retries: 2,
headless: false,
}
If you will be using headless: false mode, then make sure that viewport values are set to corresponding values for your screen dimensions. Other changes in playwright.config.js are default test timeout is set to 60000, expect assertion timeout is set to 15000, fullyParallel:false and retries are set to 2.

Test Execution
After creating an account in https://magento.softwaretestingboard.com/ and a .env file with the variables shown in th ".env copy" you may start the test execution by running npm run regession or npx playwright test regression.spec.js command.

Tests
The test suite is located in the default test folder, tests/regression.spec.js. The repeating test data has been defined in constants in the scope of the test file at the top of the tests however only itemQuantities is redefined in the tests a couple of times, therefore it is set with an initial value in beforeEach hook.

TC#1 Verify that the user is logged in with valid credentials:
This test case aims to verify that after loggin with valid credentials, the user can see their name, surname and email in my account section of the app.

Given: The user is authorized in the system.
When: The user loggs in
and: The user navigates to MyAccount section under the account dropdown
The: The user can verify that their name, surname and email details are shown in the page

TC#2 Verify that the user cannot login with invalid credentials:
This test case aims to validate that the user cannot perform a login with invalid credentials.

When: The user navigates to the login screen
and: The user attempts to login with invalid credentials
Then: The user can verify that an invalid login message is displayed to the user

TC#3 Verify that the user can create a new account:
This test case aims to verify that the user can create a new account in the system

When: The user navigates to the login screen
and: The user clicks on create a new account option
and: The user creates a new account
The: The user can verify that the succes message for the account creation is shown

TC#4 Verify that the user can login with the new account:
This test case aims to validate that previously created account can perform a successful login.

Given: The user is created a new acount as mentioned in TC#3
When: The user navigates to the login page and performs a login with new user credentials
Then: The user can verify that the user information that is shown in the app belongs to the logged in user

TC#5 Verify that the can perform a log out:
The aim of this test case is to verify that the user can perform logout.

Given: The user is logged into the system
When: The user clicks on the sign out button under the account details dropdown
Then: The user can verify that a succefful log out message is shown in the webpage

TC#6 Verify that user can search and display a product:
The aim of this test case is to verify that searching functionality works for a single item.

Given: The user is logged in
When: The user searches the item in itemName variable
Then: The user can verify that the corresponding search input is reflected in the page
and: The corresponding amount of items are listed in the page
and: The item price and the item name is corresponding based on what was searched

TC#7 Verify that user can search and display multiple products:
The aim of this test case is to verify when a general search input is provided, expected items are listed.

Given: The user is logged in
When: The user searches the items in itemName variable
Then: The user can verify that the corresponding search input is reflected in the page
and: The corresponding amount of items are listed in the page
and: The item prices and the item names are corresponding based on what was searched

TC#8 Verify that the user can perform navigation by using the nav component and breadcrumbs are updated correspondingly:
The aim of this test case is to verify that after performing a navigation within the website, the breadcrumbs show the corresponding hierarchy

Given: The user is logged in
When: The user hovers over the man category
and: The user hovers over the man tops section
and: The user clicks on man jacket section
Then: The user can verify that the breadcrumbs in the nav section are displayed in Home, Men, Tops, Jackets order

TC#9 Verify that the user can filter the results by using the filter section
This test case aims to verify that filtering the search result functionality works.

Given: The user is logged in
When: The user hovers over the man category
and: The user hovers over the man bottoms section
and: The user clicks on man pants section
and: The user expands the style filters
and: The user applies base layer filter
and: The user expands the color filters
and: The user applies black color filter
Then: The user can verify that the shown selected filters are corresponding to what user has selected
and: The user can verify that the shown item count, colors, names and prices are corresponding based on filters and based on itemName and itemPrice variables in the test block

TC#10 Verify that the user can remove the all of the applied filters with clear all button
This test case aims to verify that the user can remove applied filters by remove all filters button.

Given: The user is logged in
When: The user hovers over the man category
and: The user hovers over the man bottoms section
and: The user clicks on man pants section
and: The user expands the style filters
and: The user applies base layer filter
and: The user expands the color filters
and: The user applies black color filter
and: The user clicks on remove all filters button
Then: The user can verify that no filters are applied, total item count is 12 and black color filters are not applied on the shown items anymore.

TC#11 Verify that the user can remove filters individually
This test case aims to verify that applied search filters can be removed individually

Given: The user is logged in
When: The user hovers over the man category
and: The user hovers over the man bottoms section
and: The user clicks on man pants section
and: The user expands the style filters
and: The user applies base layer filter
and: The user expands the color filters
and: The user applies black color filter
and:The user removes the first applied filter
Then: The user can verify that the first filter is not applied anymore and total item count becomes 7
When: the user removes the second applied filter
Then: the user can verify that the second filter is not applied anymore and total item count becomes 12

TC#12 Verify that the user can add products to the cart
The aim of this test case is to verify that the user can add products to shopping cart.

Given: The user is logged in
When: The user hovers over the man category
and: The user hovers on man tops section
and: The user clicks on man jackets section
and: The user adds items given in the itemNames, temSizes, itemColors variables
and: The user expands the shopping cart details by clicking on the shopping cart icon
Then: The user can verify that the items with corresponding sizes and colors are added to the shopping cart
and: The total amount is matching with the item quantities times item base prices

TC#13 Verify that the user can edit quantity in the cart
The aim of this test case is to verify that user can change the quantities of the items in the shopping cart.

Given: The user is logged in
and: The items are added to the cart as mentioned in the TC#12
When: The user expands the shopping cart details by clicking on the shopping cart icon
and: The user changes the quantities of the items with the values of itemQuantities in TC#13
Then: The user can verify that item quantities are updated in the shopping cart
and: Total amount is updated based on new item quantitites
and: The shown total item count in the shopping cart is corresponding to itemQuantities in TC#13

TC#14 Verify that the user can remove all items in the cart
The aim of this test case is to verify that user can remove added items to the shopping cart.

Given: The user is logged in
and: The items are added to the cart as mentioned in the TC#12
When: The user removes all the added items in the cart
Then: The user can verify that "no items in cart" text is displayed in shopping cart
and: No total price and item count is shown

TC#15 Verify that the user can place an order succesfully
The aim of this test case is to verify that the user can place an order successfully

Given: The user is logged in
When: The user hovers over the man category
and: The user hovers on man tops section
and: The user clicks on man jackets section
and: The user adds the items with given size and given colors as mentioned in itemNames, itemSizes, itemColors variables
and: The usr proceeds to checkout page
and: The user fills the adresss (the adress details are hardcoded in checkoutPage.js POM) details (if there is a saved adress then it will be selected by default)
and: The user selects the free shipping option
and: The user proceeds to summary page
Then: The user can verify that the corresponding amount of count of items is shown in summary block to what was given in itemNames, itemSizes, itemColors variables
and: The user can verify that the corresponding total amount is shown in summary block to what was given in itemNames, itemSizes, itemColors variables
and: The user can verify that item sizes, colors and base prices are corresponding in the summary block to what was given in itemNames, itemSizes, itemColors variables
and: The user can verify that the shipping details is corresponding to what was filled in the first page 
When: The User places an order
Then: The user can verify that order confirmation message is displayed and order number is visible to the user


TC#16 Verify that previously placed order content is corresponding to what was ordered
The aim of this test case is to veriy that order history contains ordered items correspondingly

Given: The user is logged in
and: The user placed an order as mentioned in TC#15
When: The user navigates to MyAccount section under the account dropdown
and: The user open the order history section
and: The user opens the latest placed order details
Then: The user can verify that the order details such as item names, quantities, colors, sizes, prices are corresponding to hat was given in itemNames, itemSizes, itemColors variables
and: The user can verify that the total amount is corresponding based on item base prices and quantities
