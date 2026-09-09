import feature from "../testdata/Currentfeature.json";
import * as fs from "fs";
//import * as path from "path";
const report = require("multiple-cucumber-html-reporter");
var reporter = require('cucumber-html-reporter');
const date = new Date();
const Currentdate = `${date.getDate()}-${date.getMonth() + 1}_${date.getFullYear()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}`;
const Testscenario = feature["Test_Name"];

//const reportJson = "./test_results_BDD/Cucumber_reports/cucumber.json";
const reportPath = `./test_results_BDD/MultiCucumber_Report/${Testscenario}`;
//const renamedReportPath = `${reportPath}/${Testscenario}_${Currentdate}.html`;

const jsonSource = "./test_results_BDD/cucumber.json";
const jsonTarget = `./test_results_BDD/MultiCucumber_Report/cucumber_${Testscenario}.json`;

// Rename or copy the report with the feature name
if (fs.existsSync(jsonSource)) {
  fs.copyFileSync(jsonSource, jsonTarget);

} else {
  //console.warn(` cucumber.json not found at ${jsonSource}`);
}

// ✅ Check pass/fail from report JSON
/* const isPassed = (): boolean => {
  try {
    const json = JSON.parse(fs.readFileSync(reportJson, "utf8"));
    const statuses = json.flatMap((f: any) =>
      f.elements.flatMap((s: any) =>
        s.steps.map((step: any) => step.result.status)
      )
    );
    return statuses.every((status: string) => status === "passed");
  } catch (error) {
   // console.error(` Error parsing ${reportJson}`, error);
    return false;
  }
}; */

// ✅ Copy folders and files recursively
/* const copyRecursiveSync = (src: string, dest: string) => {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      copyRecursiveSync(srcPath, destPath);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
};
 */
// ✅ Move report folder to pass/fail
/* const moveCurrentReportToStatusFolder = (status: "pass" | "fail") => {
  const source = path.resolve(reportPath);  // ./test_results_BDD/MulticucumberReport/<Testscenario>
  const dest = path.resolve(`./test_results_BDD/${status}/${Testscenario}`);

  if (!fs.existsSync(source)) {
    //console.warn(` Report folder not found: ${source}`);
    return;
  }

  // Clean destination if already exists
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  // Recursively copy only this report folder
  const copyRecursiveSync = (src: string, dst: string) => {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      fs.mkdirSync(dst, { recursive: true });
      fs.readdirSync(src).forEach((item) => {
        const srcPath = path.join(src, item);
        const dstPath = path.join(dst, item);
        copyRecursiveSync(srcPath, dstPath);
      });
    } else {
      fs.copyFileSync(src, dst);
    }
  };

  copyRecursiveSync(source, dest);
  //console.log(`✅ Moved only current report to: ${dest}`);
}; */

// ✅ Generate the report
report.generate({
  jsonDir: "./test_results_BDD",
  reportPath: reportPath,
  reportName: `${Testscenario} Report`,
  metadata: {
    browser: {
      name: "chrome",
      version: "135",
    },
    device: "VDI",
    platform: {
      name: "windows",
      version: "10",
    },
  },
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: "Demo_Project" },
      { label: "Cycle", value: "Regression" },
      {label:"Version",value:"V1.0.1"},
      { label: "Execution Start Time", value: "Jun 23 th 2025, 10.00 AM IST" },
      { label: "Execution End Time", value: "Jun 13 th 2025," },
    ],
  },
});
export default class CucumberReporter {    
  public static generate() {
      // require('dotenv').config();
      //EnvUtil.setEnv();
      const options = {
          brandTitle: "Regression Test Report",
          theme: 'bootstrap',
          jsonFile: 'test_results_BDD/cucumber.json',
          output: 'test_results_BDD/Cucumber_reports/'+Testscenario+"/"+Testscenario+"_"+Currentdate+'.html',
          Cucumber_reportsuiteAsScenarios: true,
          scenarioTimestamp: true,
          launchReport: true,
          columnLayout: 1,
          metadata: {
                              
              

              "App Version":"1.22.10",
          "Test Environment": "QA",
          "Browser": "Chrome  5132",
          "Platform": "Windows 10",
          "Parallel": "Scenarios",
          "Executed": "Remote"
          }
      };
      reporter.generate(options);
  }
}
CucumberReporter.generate();

// ✅ Rename the main report file (optional)
/* const originalIndex = path.join(reportPath, "index.html");
if (fs.existsSync(originalIndex)) {
  fs.copyFileSync(originalIndex, renamedReportPath);
 // console.log(`✅ Renamed report to: ${renamedReportPath}`);
}

// ✅ Move based on pass/fail
if (fs.existsSync(reportJson)) {
  const status = isPassed() ? "pass" : "fail";
  moveCurrentReportToStatusFolder(status);
} else {
  //console.warn(` Report JSON not found: ${reportJson}`);
}//ccls
 */