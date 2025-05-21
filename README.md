# Luma E-Commerce UI Automation Demo Project with PlayWright JS
This project contains a demo UI automation tests for the Luma E-Commerce demo site, built using Playwright and JavaScript. It follows the Page Object Model (POM) design pattern for better maintainability and readability. You may visit the website [here](https://magento.softwaretestingboard.com/). 
***  
  
>## **Luma_E-Commerce/**
>
>>**tests/** - Test scenarios
>>
>>**Page Object Modal/** - Page Object Model classes
>>
>>**fake_people_testData/** - Fake user credentials are stored here to be used in tests
>>
>>**order_Number/** - An order number is stored here to be used in tests
>>
>>**session_generator.js** - A custom function to create a user session to bypass login during test execution
>>
>>**playwright.config.js** - Playwright configuration
>>
>>**.env** - Environment variables (User should create a .env by following the template in the .env copy)
>>
>>**package.json** - Project dependencies
>>
>>**README.md** - Project documentation

 
## Technologies Used

* PlayWright
* JavaScript (Node.js)
* dotenv

## Getting Started
1. Clone the repository
> `git clone https://github.com/bulutyesilyurt/Luma_E-Commerce.git`
>
> `cd Luma_E-Commerce`
2. Install dependencies
> `npm install`
3. Configure environment variables
>  Create an account in [Luma E-Commerce.](https://magento.softwaretestingboard.com/) Create a .env file by referring to the .env copy and place the necessary account information into the .env.
4. Configure the playwright.config.js with your specifications
> Please refer to the next section to get more information about the project configuration.
5. Run the test
> Use `npm run regression` or `npx playwright test regression.spec.js`. Please see the Tests section for more information about the tests.


## playwright.config.js
The project uses the default PlayWright config file with some customizations. 
* globalSetup: In order to bypass the login process in each test execution, a custom function is called, see `globalSetup: "./session_generator.js"`. Before any test, the function in the session_generator.js file logs in to the system and saves the user session to loginAuth.json, see `storageState:"./loginAuth.json"`. Except for some test cases, the browser will automatically log in with the context in the loginAuth.json file. 
* Timeouts: The default test timeout is set to 60000ms, see `timeout: 60000`. And expect assertion timeout is set to 15000ms, see `expect: {timeout:15000}`.
* Workers and Parallel Mode: Parallel test execution is disabled due to the logic of the test structure, and tests are running with 1 worker. See `fullyParallel: false` and ` workers: process.env.CI ? 1 : undefined`.
* Reporting: For test results, the html reporter is defined, see `reporter: "html"`. In addition, for test artifacts `trace: "on-first-retry"`, `screenshot: "only-on-failure"`, `video: "retain-on-failure"` are also set.
* Retry: It is likely that the web page's response time can get very slow sometimes, as there might be others running various tests simultaneously, therefore, failing test retries are set up to 2, see `retries: 2`.
* Projects: Only Google Chrome browser is enabled in the scope of this project in headed mode. If you are considering running tests with `headless: false`, please make sure that viewport properties are corresponding to your screen ,dimensions which is currently set as `viewport: { width: 2520, height: 1280 }`.

## Tests
Currently, there is 1 test suite which is located at tests/regression.spec.js. The test suite consists of 16 test cases that focus on the main functionality. The repetitive test data is defined in variables at the top of the test file. You may find these test cases in BDD format and with descriptions in [this document](https://docs.google.com/spreadsheets/d/1HlQjP9GL1UNQqK84gXl_qMCTyHsRgcgYR2Hj2MKvjLs/edit?gid=0#gid=0).
