import fs from 'fs';
import path from 'path';

const report = require("multiple-cucumber-html-reporter");
//const htmlReporter = require('cucumber-html-reporter');
const reportJson = "./test_results_BDD/MultiCucumber_Report/";
const reportPath = `./test_results_BDD/MultiCucumber_Report/`;
const reportName= 'Demo_Project - Test Summary Report';
//const finalDir = path.resolve(__dirname, '../test_results_BDD/final');
//const finalJson = path.join(finalDir, 'Batchcucumber.json');


// Step 1: Merge all cucumber_TC*.json files
function mergeCucumberJsons(): void {
  const files = fs.readdirSync(reportJson).filter(f => f.endsWith('.json'));

  let merged: any[] = [];

  for (const file of files) {
    const filePath = path.join(reportJson, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      if (!content) {
        continue;
      }

      const data = JSON.parse(content);
      merged = merged.concat(data);
    } catch (error) {
      console.warn(`Skipping invalid JSON report file: ${filePath}`);
      console.warn(error);
    }
  }

  /* if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });
  fs.writeFileSync(finalJson, JSON.stringify(merged, null, 2), 'utf-8');
  console.log(`✅ Merged ${files.length} JSON files into ${finalJson}`); */
}

mergeCucumberJsons();
/* htmlReporter.generate({
  theme: 'bootstrap',
  jsonFile: finalDir,
  output: './test_results_BDD/final/Batch_cucumber_report.html',
  Cucumber_reportsuiteAsScenarios: true,
  
  launchReport: false,
  metadata: {
    "App Version": "1.0",
    "Test Environment": "QA",
    "Browser": "Chrome 135",
    "Platform": "Windows 10",
    "Executed": "Remote",
  },
});
 */
// ✅ Generate the report
report.generate({
  jsonDir: "./test_results_BDD/MultiCucumber_Report",
  reportPath: reportPath,
  reportName: reportName,
  displayDuration: true,
  theme: 'dark',
  disableLog: false,
  

displayReportTime: true,

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
      { label: "Project", value: "Demo_Project_Goibibo" },
      {label: "Release", value: "1.0.0"},
     
      { label: "Cycle", value: "Regression" },
      { label: "Execution Start Time", value: "Jun 16 th 2025, 03.00 PM EST" },
      { label: "Execution End Time", value: "Jun 16 th 2025," },
    ],
  },
});
