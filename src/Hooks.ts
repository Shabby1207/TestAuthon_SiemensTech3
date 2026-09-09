//@autor :Suneetha K
import { ICustomWorld } from './Custom-world';
import { Before, After, BeforeAll, AfterAll,  setDefaultTimeout } from '@cucumber/cucumber';
//import   testdata from "../testdata/testdata_Goibibo.json";
import { WebActions } from '../Lib/WebActions'
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
//const playwright = require('playwright');
import {
  ChromiumBrowser,
 firefox,
 chromium,
 devices,
  FirefoxBrowser,
  LaunchOptions,
  webkit,
  WebKitBrowser,
} from 'playwright';
import { ITestCaseHookParameter } from '@cucumber/cucumber/lib/support_code_library_builder/types';

dotenv.config({ override: true });

//import { Pickle } from '@cucumber/messages';

// eslint-disable-next-line no-var
var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
let activeBrowserName: 'chromium' | 'firefox' | 'webkit' = 'chromium';

declare global {
  // eslint-disable-next-line no-var
  var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 40000);
//const extensionPath = './extension'
const browserOptions: LaunchOptions = {
  headless: false,
  slowMo: 0,
  
  //args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', `--disable-extensions-except=${extensionPath}`,
 // `--load-extension=${extensionPath}`,],
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--disable-popup-blocking',
    '--disable-notifications',
    '--disable-infobars'
  ],


  //downloadsPath : browser.downloadsPath
  //executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",

 /* firefoxUserPrefs: {
    'media.navigator.streams.fake': false,
    'media.navigator.permission.disabled': false,
  },*/
};

function isMobileRun(): boolean {
  return (process.env.MOBILE_EMULATION || '').toLowerCase() === 'true';
}

function getMobileContextOptions() {
  const deviceName = process.env.DEVICE_NAME || 'Pixel 5';
  const device = devices[deviceName];

  if (!device) {
    throw new Error(`Unsupported DEVICE_NAME: ${deviceName}. Use a valid Playwright descriptor from npm run mobile:devices.`);
  }

  const { defaultBrowserType, ...deviceContextOptions } = device;
  return {
    deviceName,
    contextOptions: {
      ...deviceContextOptions,
      isMobile: true,
      hasTouch: true,
      acceptDownloads: true,
      recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
    },
  };
}
//@autor :Suneetha K
BeforeAll(async function () {
  const browserName = (process.env.BROWSER || 'chromium').toLowerCase();

  switch (browserName) {
      case 'firefox': {
        activeBrowserName = 'firefox';
        const { channel, ...firefoxOptions } = browserOptions as LaunchOptions & { channel?: string };
        browser = await firefox.launch(firefoxOptions);
        break;
      }
      case 'webkit': {
        activeBrowserName = 'webkit';
        const { channel, ...webkitOptions } = browserOptions as LaunchOptions & { channel?: string };
        browser = await webkit.launch(webkitOptions);
        break;
      }
      case 'chromium':
        activeBrowserName = 'chromium';
        browser = await chromium.launch({ ...browserOptions, channel: process.env.CHROMIUM_CHANNEL || 'chrome' });
        break;
      default:
        activeBrowserName = 'chromium';
        browser = await chromium.launch({ ...browserOptions, channel: process.env.CHROMIUM_CHANNEL || 'chrome' });
      

      //browserType ='Chromium'
    //var userDataDir="C://Users//Z004N63C//Downloads"
   // browser = await playwright['chromium'].launchPersistentContext(userDataDir,browserOptions)
      //browser = await webkit.launch(browserOptions);
 }
 
});

Before({ tags: '@ignore' }, async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'skipped' as any;
 
});

Before({ tags: '@debug' }, async function (this: ICustomWorld) {
  this.debug = true;
});

Before(async function (this: ICustomWorld) {
  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)
  if (isMobileRun()) {
    const mobile = getMobileContextOptions();
    console.log(`Running in mobile emulation mode using device: ${mobile.deviceName}`);
    this.context = await browser.newContext(mobile.contextOptions);
  } else {
    const permissions = activeBrowserName === 'webkit'
      ? ['geolocation']
      : ['geolocation', 'notifications'];

    this.context = await browser.newContext({
      acceptDownloads: true,
      permissions,
      recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
      viewport: { width: 1400, height: 1024 }
    });
  }

  this.page = await this.context.newPage();
  this.page.on('dialog', async (dialog) => {
    await dialog.dismiss().catch(() => {});
  });
  this.page.on('popup', async (popupPage) => {
    popupPage.on('dialog', async (dialog) => {
      await dialog.dismiss().catch(() => {});
    });
    // Close unexpected marketing popups/tabs and keep payment popups open.
    if (!/checkout|payment|razorpay|bank/i.test(popupPage.url())) {
      await popupPage.close().catch(() => {});
    }
  });
  await this.page.setDefaultTimeout(6000);
  if (this.context?.tracing) {
    await this.context.tracing.start({
      screenshots: true,
      snapshots: true,
    });
    this.tracingStarted = true; // 👈 Track if tracing started
  }
});
Before(async function(feature) {
  // Store scenario name on context. 
  // We need this for auto-named snapshots.

  //var feature :any
  this.page.waitForTimeout(8000)
  this.featurename = feature .pickle.name;
    var Test_Name
  Test_Name=feature .pickle.uri
  Test_Name= Test_Name.split("\\")[1]
  Test_Name=Test_Name.split(".")[0]
  console.log("Hooks"+this.featurename)
  //this.page.timeout(8000)
  this.page.waitForTimeout(8000)
  //testdata['Project Features'].CurrentFeature =Test_Name
  //console.log(".........................The Test Execution For Scenario----"+Test_Name+"Started .........................................")
 // testdata['Project Features'].Test_Name =this.featurename
  const fs = require("fs").promises
  
// Storing the JSON format data in myObject
var data = process.env.PATH_VAL+"/testdata/Currentfeature.json"

const file = require(data);//);
//var myObject = JSON.parse(data);

file.CurrentFeature= this.featurename
file.Test_Name= Test_Name

// Defining new data to be added
let newData = {
  "CurrentFeature": this.featurename,
  "Test_Name":file.Test_Name
} 

// Adding the new data to our object

  
// Writing to our JSON file
//var newData2 = JSON.stringify(file,null,2);
var newData2 = JSON.stringify(newData,null,2);
/* fs.writeFileSync(data, newData2 ,function writeJSON(error:any,callback:any){
   
  if (error) {
    console.log('Error writing file:', error);
    callback(error)
    return 
} else {
    console.log('Successfully wrote file');
    


} */
await fs.writeFile(data, newData2)

this.  page.waitForTimeout(10000)
 //this.page.waitForTimeout(20000)
 //await fs.readFile(data, newData2)
 //fs.readFile(data, "utf8", (error:any, jsonString:any) => {
 // console.log("data"+data)
 // const readData= fs.readFile (data)
  //console.log("readData"+readData)
  const jsonString = await fs.readFile(data, "utf8")
 
  var  readData1=JSON.parse(jsonString)
console.log(JSON.parse(jsonString));
console.log("Readdata.Test_Name"+readData1.Test_Name)
console.log("feature.pickle.uri:"+feature.pickle.uri)
if(readData1.Test_Name==feature.pickle.uri)
{
  console.log("Data successfully updated to currentfeature file")
}
else
{
  console.log("Data failed to update to currentfeature file")
}
const test =new WebActions(this.page) 
var   TestNode :any        
TestNode= await  test.GetTestData_Node(readData1.Test_Name) 
if (!TestNode) {
  throw new Error(`Test data node not found for scenario key: ${readData1.Test_Name}`);
}
console.log("TestNode.Contact_MailAddress --"+TestNode.Contact_MailAddress)
console.log ("TestNode  --"+TestNode)
var data_path = process.env.PATH_VAL+"/testdata/Data_Read.json"
var TestNode_outdata = JSON.stringify(TestNode,null,2);
await fs.writeFile(data_path, TestNode_outdata)

//this.page.waitForTimeout(20000)
  this.page.waitForTimeout(10000)
  //await fs.readFile(data, newData2)
  //fs.readFile(data, "utf8", (error:any, jsonString:any) => {
  // console.log("data"+data)
  // const readData= fs.readFile (data)
  //console.log("readData"+readData)
  const jsonString_datafetched = await fs.readFile(data_path, "utf8")
  
  var  readData1=JSON.parse(jsonString_datafetched)
//  console.log("TestNode.Contact_MailAddress_2--"+TestNode.Contact_MailAddress)
//console.log(JSON.parse(jsonString_datafetched));
//console.log(JSON.stringify(jsonString_datafetched, null, 2))  
          
});
 
//callback();




After(async function (this: ICustomWorld, hookParameter: ITestCaseHookParameter) {
  const { result, pickle } = hookParameter;
  if (!result) return;
  const resultDetails = result as unknown as {
    message?: string;
    exception?: { message?: string; stack?: string } | string;
    stack?: string;
  };

  // Prepare names and folders
  const scenarioName = pickle.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotDir = 'test_results_BDD/Playwright-Artifacts/screenshots';
  const traceDir = 'test_results_BDD/Playwright-Artifacts/traces';
  const screenshotFile = `${scenarioName}_${timestamp}.png`;
  const traceFile = `${scenarioName}_${timestamp}_trace.zip`;

  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
  if (!fs.existsSync(traceDir)) fs.mkdirSync(traceDir, { recursive: true });

  const screenshotPath = path.join(screenshotDir, screenshotFile);
  const tracePath = path.join(traceDir, traceFile);

  // Attach status and duration
  await this.attach(`Status: ${result.status}, Duration: ${result.duration?.seconds || 0}s`);
  // Conditional logic: pass or fail
  if (result.status == "FAILED") {
    await this.attach(`❌ Scenario "${scenarioName}" failed`);
    const errorMessage =
      resultDetails.message ||
      (typeof resultDetails.exception === 'string' ? resultDetails.exception : resultDetails.exception?.message) ||
      'No failure message provided by Cucumber runtime.';
    await this.attach(`Failure message: ${errorMessage}`, 'text/plain');

    const errorStack =
      resultDetails.stack ||
      (typeof resultDetails.exception === 'string' ? undefined : resultDetails.exception?.stack);
    if (errorStack) {
      await this.attach(`Failure stack:\n${errorStack}`, 'text/plain');
    }

    if (this.page && !this.page.isClosed()) {
      await this.attach(`Current URL: ${this.page.url()}`, 'text/plain');
      try {
        const pageTitle = await this.page.title();
        await this.attach(`Current title: ${pageTitle}`, 'text/plain');
      } catch {
        // Ignore page title read failures in teardown.
      }
    }
  } else if (result.status == "PASSED") {
    await this.attach(`✅ Scenario "${scenarioName}" passed`);
  }

  // Trace (optional): only if tracing was started

  try {
    // ✅ Only stop if tracing actually started
    if (this.context && this.tracingStarted) {
      await this.context.tracing.stop({ path: tracePath });
    }
  } catch (err) {
    console.error('⚠️ Failed to stop tracing:', err);
  }
  await this.attach(`<a href="../test_results_BDD/Playwright-Artifacts/screenshots/${screenshotFile}" target="_blank">📸 View Screenshot</a>`, 'text/html');
  await this.attach(`<a href="../test_results_BDD/Playwright-Artifacts/traces/${traceFile}" target="_blank">📦 View Trace</a>`, 'text/html');

  // Screenshot (always)
  if (this.page) {
    try {
      const image = await this.page.screenshot({ path: screenshotPath, fullPage: true });
      await this.attach(image, 'image/png');
    } catch (err) {
      console.error(`Error taking screenshot for ${scenarioName}:`, err);
    }
  }

  
   if (this.page && !this.page.isClosed()) {
    await this.page.close();
  }
  if (this.context) {
    await this.context.close();
  }
  //await this.page?.waitForTimeout(5000);
 
  });
AfterAll(async function () {
  console.log(".........................The test run is completed .........................................")
  await browser.close();
 
})
  
