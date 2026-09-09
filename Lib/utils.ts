//@autor :Suneetha k 
//Basic Util functions perform webactions like fill ,click,select,etc

import { Page } from 'playwright';
import {assert} from 'chai'
import moment from "moment";
export async function hasClass(page: Page, selector: string, className: string): Promise<boolean> {
  await page.waitForSelector(selector);
  return await page.$eval(selector, (el, className) => el.classList.contains(className), className);
}

export async function getElementsCount(page: Page, selector: string): Promise<number> {
  return await page.$$eval(selector, (els) => els.length);
}

export async function waitForNthElement(
  page: Page,
  selector: string,
  index: number,
): Promise<void> {
  await page.waitForSelector(`${selector}:nth-of-type(${index})`);
}

export async function getNodeName(page: Page, selector: string): Promise<string> {
  return page.$eval(selector, (e) => e.nodeName);
}

export async function getText(page: Page, selector: string): Promise<string | null> {
  
  var text=await page.locator(selector).textContent()
  return text
}

export async function getBoundingBox(
  page: Page,
  selector: string,
): Promise<{
  x: number;
  y: number;
  width: number;
  height: number;
} | null> {
  const el = await page.waitForSelector(selector);
  await el. waitForElementState('stable');
  const box = await el.boundingBox();
  el.dispose();
  return box;
}

export async function getCenterPoint(
  page: Page,
  selector: string,
): Promise<{ x: number; y: number } | undefined> {
  const box = await getBoundingBox(page, selector);
  if (!box) return;
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

export async function getStyleValue(
  page: Page,
  selector: string,
  key: string,
): Promise<string | undefined | null> {
  await page.waitForSelector(selector);
  const styleAttribute = await page.getAttribute(selector, 'style');
  if (!styleAttribute) return;
  const exp = new RegExp(`${key}:(.+?);`);
  const res = exp.exec(styleAttribute);
  return res && res.pop()?.trim();
}

export async function getTexts(page: Page, selector: string): Promise<Array<string | null>> {
  return await page.$$eval(selector, (els) => els.map((e) => e.textContent));
}
export async function ifill(page: Page, selector: string, Dataval: any) {
  
  await page.waitForSelector(selector)
  try{
  if(await page.isEnabled(selector))
  {
  await page.locator(selector).fill(Dataval)
  }
}catch(error){

  assert.fail ("selector" + selector + "is disabled")
}
}
export async function iclick(page: Page, selector: string) {
  
  await page.waitForSelector(selector)
  try{
  if(await page.isEnabled(selector))
  {
  await page.locator(selector).click()
  }
}catch(error){

  assert.fail ("selector" + selector + "is not displayed")
}
}

export async function  iselect(page: Page, selector: string,valueToselect :any) {
  await page.waitForSelector(selector)
  try{
    if(await page.isEnabled(selector))    
    { //await page.locator(selector).click
      await page.locator(selector).selectOption(valueToselect )
    }
  }catch(error){
  
    assert.fail ("selector" + selector + "is not displayed")
  } 

}
export async function  iselectByIndex(page: Page, selector: string,index :any) {
  await page.waitForSelector(selector)
  try{
    if(await page.isEnabled(selector))    
    { await page.locator(selector).click
      await page.locator(selector).selectOption(index )
    }
  }catch(error){
  
    assert.fail ("selector" + selector + "is not displayed")
  } 

}
export async function  iselectByText(page: Page, selector: string,valueToselect :any) {
  await page.waitForSelector(selector)
  try{
    if(await page.isEnabled(selector))    
    { //await page.locator(selector).click
   
      await page.locator(selector).selectOption({ label: valueToselect });
    }
  }catch(error){
  
    assert.fail ("selector" + selector + "is not displayed"+error)
  } 

}
export async function  iselectByListVal(page: Page, selector: string,valueToselect :any) {
  await page.waitForSelector(selector)
  var expression = `/^${valueToselect}$`;
  var re = new RegExp(expression, 'g');
  
  console.log("valueToselect"+re)
  try{
    if(await page.isEnabled(selector))    
    { //await page.locator(selector).click
   
      //await page.locator(selector).selectOption({ label: valueToselect });
      await page.locator(selector)
          .locator("li", {
            
            hasText: new RegExp((`^${valueToselect}$`),'g') 
            
          }).dblclick()
          await page.waitForTimeout(4000)
    }
  }catch(error){
  
    assert.fail ("selector" + selector + "is not displayed")
  } 



}

/**
 * Select the dropdown by Label
 * @param text
 * @returns
 */


export async function DataNode()
{
  
 const fs = require("fs");
      const path = "./testdata/Currentfeature.json";
   
      var  DataNode
      fs.readFile(path, "utf8", (error:any, jsonString:any) => {
        
        if (error) {
            console.log("Error reading the JSON file:", error);
            return;
        }
        try { 
            const TestScenarioDetails = JSON .parse(jsonString);
            var TestScenarioName=TestScenarioDetails.Test_Name
            console.log("TestScenarioName--"+TestScenarioName)
            DataNode=TestScenarioName
          
            

        } 
        catch (error) {
            console.log("Error parsing JSON string:", error);
        }
       
        
    });
    return DataNode 
    
  }

  export async function Invoke_Window(FilePath:String)
  {
    const { exec } = require("child_process");
   console.log("FilePath"+FilePath)
    exec(FilePath, (error:any, stdout:any, stderr:any) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });  
  
  }
  

  export async function dateGenerator(format: string, days: number, months: number, years: number) {
    //var date=new Date();
    const date1 =moment().add(days, 'd').add(months, 'M').add(years, 'y')
.format(format);   
    return date1;
    console.log('date1'+date1)
 }
 export async function downloadFiles(page :Page,selector:string,file_Path:any) {
   
  let fileName1: string;

  //var  path="./test_results/Downloads/"+File

    page.locator(selector).click()
   const [download] = await Promise.all([
      page.waitForEvent(('download'),{timeout:2000000}),
      //
    ]);
   
    fileName1 = download.suggestedFilename();
    file_Path=process.env.PATH_VAL+file_Path

    await download.saveAs(file_Path);
    await download.delete();
   
  
  return fileName1;
}