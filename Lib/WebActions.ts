//@autor :Suneetha k 
// Web Reusable s  functions 

import feature1 from "../testdata/Currentfeature.json"
//import test = require("../Lib/utils")   

import { assert } from "chai";
import testdata from "../testdata/testdata.json"
import { Page ,expect} from '@playwright/test'
import { BrowserContext,  } from "playwright";

import { World as CucumberWorld } from "@cucumber/cucumber"

export interface Login extends CucumberWorld {
  context: BrowserContext;
  page: Page;
  page1: Page;

}
export class WebActions {

  page: Page

  constructor(page: Page) {
    
    this.page = page
    //this.World = world

  }

 // Function to read text from textfileled or webelement(innertext) 
  public async  getText(page: Page, selector: string) {

   
  try{ 
    await this.page.waitForTimeout(9000)
    await expect(page.locator(selector)).toHaveCount(1)
    if(await page.$(selector))
   {   
    return await page.$eval(selector, (e) => e.textContent);
   }
 }     
catch(error)
{
     assert.fail ("object not visible"+error)
}
return await page.$eval(selector, (e) => e.textContent);


}
  // Function to get text from fields basing on the attribute value (e.g ="href of <a>,"text" of <input>)
  public async  getAttributeValue(page: Page, selector: string, attribute :string) {
   try{ 
         if(await page.locator(selector).isVisible())
        {   
          return await page.locator(selector).getAttribute(attribute);
        }
      }     
   catch(error)
   {
          assert.fail ("object not visible"+error)
   }
   return await page.locator(selector).getAttribute(attribute);
    
   
  }
  // Function to downloadfile 
  public async downloadFile(page :Page,selector:string) {
   
    let fileName1: string;
    
      page.locator(selector).click({ modifiers: ["Alt"] })
     const [download] = await Promise.all([
        page.waitForEvent(('download'),{timeout:50000}),
        //
      ]);
     
      fileName1 = download.suggestedFilename();
      
      const filePath = process.env.PATH_VAL+"/test_results/Downloads/DEMO_en.pdf";
      await download.saveAs(filePath);
      await download.delete();
      //return fileName1;
        
      //console.log(error)
    
    return fileName1;
  }
  async decipherPassword(password:any): Promise<string> {
    const key = 'SECRET-KEY';
    //ENCRYPT
    //const cipher = CryptoJS.AES.encrypt('Jf07Cd6k,*Ls@09',key);
   //console.log(cipher.toString());
   try{
    var password:any
    
    password= CryptoJS.AES.decrypt(password, key)
    password=password.toString(CryptoJS.enc.Utf8);
   }catch(error)
   {
    console.log(error)
   }
    return password
}
async encryptPassword(password:any): Promise<string> {
  const key = 'SECRET_KEY';
  
  //ENCRYPT
  const cipher = CryptoJS.AES.encrypt(password,key);
 console.log(cipher.toString());
  return cipher.toString()
}

public DeleteFilefromPath(File:String)
{   const fs = require("fs");
  //var  path="./test_results/Downloads/"+File
  var  path=File
      if (fs.existsSync(path)) {
        fs.unlinkSync(path)
      }
      else 
      {
        console.log("File Not Found to delete")
      }
      
}
public  CheckFileinPath(File:String)
{   const fs = require("fs");
  //var  path="./test_results/Downloads/"+File
  var fileexist =false
  if(File!=""){
        console.log("filedownload "+File)
        var  path=File
            if (fs .existsSync(path)) {
              fileexist = true
              console.log("File to download present in path "+File)
            }
            else 
            {
              console.log("File Not Found ")
              fileexist = false
            }
           
}
else
{
  console.log("File Path is Null "+File)
}
return fileexist 
}

public  DataNode12() {
    
  try{    
      var path="./testdata/testdata_Goibibo.json"
      let DataNode1 :any 
      const fs = require("fs");
      //
      let json = fs.readFileSync(path, 'utf-8');
      const purchase_hist = JSON .parse(json);
      
      var CurrentTestscenario= feature1['Test_Name']
          
          for (var key in purchase_hist) {
            console.log(key);
            if(key==CurrentTestscenario)
             {  //Datanode : any
              DataNode1 = testdata["TC_02_Flights_SearchFlightDetails"]
            //return Datanode
            console.log(key);
            console.log(purchase_hist[key]);
             }
           
        }
          

      
    return DataNode1
  } catch (error) {
    console.log("Error parsing JSON string:", error);
}
}
public async getPageTitle(): Promise<string> {
  let title: string;
  
    title = await this.page.title();
  
  return title;
}
public  GetTestData_Node(filename:any) {
    
  try{   
    var DataNode1 :any  
    
      var CurrentTestscenario:any    
      
      
     CurrentTestscenario= filename
     
     console.log("CurrentTestscenario:"+CurrentTestscenario) ;
     if(CurrentTestscenario!="undefined" || CurrentTestscenario!="")
    {  if(CurrentTestscenario=="TC_01_Validating_HomePage_Objects")
     {  //Datanode : any
              DataNode1 = testdata["TC_01_Validating_HomePage_Objects"]            //return Datanode
            //console.log(key);
           
      }
      else if(CurrentTestscenario=="TC_02_Flights_SearchFlightDetails")   
      {
        DataNode1 = testdata["TC_02_Flights_SearchFlightDetails"]
      }
      else if(CurrentTestscenario=="TC_03_Mobile_Flight_Search")
      {
        DataNode1 = testdata["TC_03_Mobile_Flight_Search"]
      }
      else if(CurrentTestscenario=="TC_04_MakeMyTrip")
      {
        DataNode1 = testdata["TC_04_MakeMyTrip"]
      }
      else if(CurrentTestscenario=="TC_05_Gajab_Login")
      {
        DataNode1 = testdata["TC_05_Gajab_Login"]
      }
      else if(CurrentTestscenario=="TC_05_Gajab_Bargaining_Application")
      {
        DataNode1 = testdata["TC_05_Gajab_Login"]
      }
      else if(CurrentTestscenario=="TC_06_Gajab_Login_And_Home_Validation")
      {
        DataNode1 = testdata["TC_06_Gajab_Login_And_Home_Validation"]
      }
  
  
          }
    else
    {
      console.log("The test Data node not found")
      assert.fail("The test Data node not found")
    }
      
      
    return DataNode1
  } catch (error) {
    console.log("Error parsing JSON string:", error);
}
}
//Function will read alll the column name of a table
public async  getColumnName(page: Page, selector: string) {
  const table = page.locator(selector);
  const headers = table.locator("thead");
  //const header = table.locator(headerx);
  var allColName: any= await headers.allTextContents();
 
  console.log("All column names : "+allColName)
  

  return allColName
 
}
public async Validate_Object_Status(page: Page, selector: string,StaustoCheck: String){
  try{
    var objStatus:any
    if(StaustoCheck=="Enabled"){
     objStatus= await page.locator(selector).isEnabled()
      if (await page.locator(selector).isEnabled()){
      console.log("Object Present in Expected Status :"+ StaustoCheck)
      objStatus = true
      }
      else {
      console.log("Object not displayed in Expected Status :"+ StaustoCheck)
      objStatus = false
      assert.fail(selector +" is not Enabled")
   
        }
    }
    if(StaustoCheck=="Disabled"){
      if (await page.locator(selector).isDisabled())
      console.log("Object Disabled")
      
      else{
      console.log(selector +" is not disabled")
      assert.fail(selector +" is not disabled")
        }
    }
    if(StaustoCheck=="isVisible"){
    if (await page.locator(selector).isVisible())
     {
      console.log("Object is visible")
      objStatus = true
     }
      else{
      console.log("Object is not visible ")
      objStatus = false
      assert.fail(selector +" is not Enabled")
        }
      }
      return objStatus
  }
  
  catch(error){
    console.log(selector +" Available")
  }
}

  

  public async Validate_PageTitles(page:Page,Linkselector :string,TextSelector:string,Menu_Title: String)
  {
    try{
    if(Linkselector!="NoClick"){  
       await page.click(Linkselector,{delay:10000})
       if((Menu_Title.toUpperCase()=="LAST FILES")||(Menu_Title.toUpperCase()=="FILES IN PERIOD")||(Menu_Title.toUpperCase()=="Dateien in Zeitraum"))
    {
      await this.page.waitForTimeout(40000)
    }
    }  
    else
    {
      console.log("No Link to click")
    }
    await this.page.waitForLoadState("networkidle")
      
    var out_Menu_Tilte :any = await this.getText(this.page,TextSelector)
    
    out_Menu_Tilte= out_Menu_Tilte.toUpperCase()
    Menu_Title=Menu_Title.toUpperCase().trim()
    console.log("Menu_Title_Input-"+Menu_Title)
    out_Menu_Tilte=out_Menu_Tilte.trim()
    let expression= ".*"+Menu_Title+".*"

                        let re = new RegExp(expression, 'g');
                        re.test(out_Menu_Tilte)
                        console.log(" re.test(out_Menu_Tilte)"+ re.test(out_Menu_Tilte))
                       console.log( "Output_Expected_Data.matchAll(re)"+out_Menu_Tilte.matchAll(re))
                    if((re.test(out_Menu_Tilte)==true)||(out_Menu_Tilte.trim()==Menu_Title.trim()))    
                    {
                      console.log(Menu_Title+" :Page Title displayed successfully")
                    
                    }
                    else
                    {
                      console.log(out_Menu_Tilte+" :Page Title notdisplayed")
                      assert.fail("Page Title not displayed")
                    }
     }
  
catch(error)
{
  console.log("Page Title notdisplayed" +error)
  assert.fail("Page Title not displayed" +error)
}
return true }



 
public async GetTestData()
{
   try {
   const fs = require("fs").promises
   var data_path = process.env.PATH_VAL+"/testdata/Data_Read.json"

   const jsonString_datafetched = await fs.readFile(data_path, "utf8")  
   let  readData1=JSON.parse(jsonString_datafetched)   
   return  readData1

 }

  catch (error) {
    console.log("Error parsing JSON string:", error);
   }
  }
}