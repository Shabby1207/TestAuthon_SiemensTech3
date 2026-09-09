
import dotenv from 'dotenv';
dotenv.config({ override: true })
import pdfParse from 'pdf-parse'
//import * as CryptoJS from 'crypto-js';

import  util = require("../Lib/utils")
import LoginSelector from "../selectors/CommonSelectors.json";
//import StartPageSelector from "../selectors/StartPageSelectors.json";
import testdata from "../testdata/testdata.json"
import { Page } from '@playwright//test'
import { assert, expect, } from "chai";


import { WebActions } from '../Lib/WebActions'
//import { StartPage } from './StartPage';

export  class LoginPage extends WebActions {

  page: Page
  test: WebActions
  
  constructor( page: Page) {

    super(page);
    this.page = page    
    this.test=new WebActions(page);
    
  }
 

  public  DataNode2( ) {
    let DataNode2 :any
    DataNode2 =  this.test.GetTestData()
    return DataNode2
  }
  public async LaunchApplication() {
  try { 
      // let TestNode :any
      // TestNode= this.test.ActionsP.GetTestData() 
      let TestNode :any
      TestNode=await  this.test.GetTestData()  
      console.log(TestNode);
     var  URL :any
       URL =process.env.APP_URL    
      await this.page.goto(URL, { timeout: 20000 })      
      await expect('//*[@id="get_sign_in"]/div/ul/li[2]', "Waiting for Application Launching")
      await this.page.screenshot({ path: 'output/${playwright.chromium.name()}.png' });
      var pageTitle = await this.page.title()
      this.page.fill
      // if (pageTitle == "Goibibo - Best Travel Website. Book Hotels, Flights, Trains, Bus and Cabs with upto 50% off") {
        if (pageTitle == TestNode.title) {
        console.log("Application Launched Successfully")
          const closePopup = this.page.locator('//span[@class="logSprite icClose"]');
          if (await closePopup.count() > 0) {
            await closePopup.first().click();
          }
        await this.page.waitForTimeout(5000)
        return true
      
 
      }
      else {
          return false
        

      }




    }
    catch (error) {
      assert.fail("Loginfailed" + error)

    }
  }
  public async LoginToApplication(User:String) {
  try {
    //let TestNode :any
    //TestNode=await  this.test.GetTestData()  
    //console.log(TestNode);
      //var TestNode = testdata['Create_Invoice']
      //let bytes = await CryptoJS.AES.decrypt("Jf07Cd6k,*Ls", "SECRET_KEY");
   /* let decryptedKey = await bytes.toString(CryptoJS.enc.Utf8);
    console.log(decryptedKey);
      var password1:any
      var Password:any
       password1=this.test.encryptPassword("Jf07Cd6k,*Ls")
      Password=this.test.decipherPassword(password1)
      const key = 'SECRET-KEY';
    //ENCRYPT
    //const cipher = CryptoJS.AES.encrypt('Jf07Cd6k,*Ls@09',key);
   //console.log(cipher.toString());
   //password1=this.test.encryptPassword("Jf07Cd6k,*Ls")
   Password= CryptoJS.AES.decrypt(password1, key)
   Password=Password.toString(CryptoJS.enc.Utf8);*/
  
      await this.page.waitForSelector('//*[@id="password"]');
      if (await this.page.isVisible(LoginSelector.Password)) {
        if(User=="Basic User"){
        await util.ifill(this.page,LoginSelector.UserName, process.env.BASIC_USER_NAME)
        await  util.ifill(this.page,LoginSelector.Password, process.env.BASIC_USER_PASSWORD)
       // await  util.ifill(this.page,LoginSelector.Password, Password)
        }
        if(User=="Admin User"){
          await util.ifill(this.page,LoginSelector.UserName, process.env.ADMIN_USER_NAME)
          await  util.ifill(this.page,LoginSelector.Password, process.env.ADMIN_USER_PASSWORD)
         // await  util.ifill(this.page,LoginSelector.Password, Password)
          }

      }

      return 'pending';
    }
    catch (error) {
      assert.fail("Loginfailed" + error)

    }
  }
  public async ValidateHomePage() {
    try {  await this.page.waitForTimeout(5000)
      await this.page.waitForSelector(LoginSelector.MainPage_Link_User_Logout)
      if (await this.page.isVisible(LoginSelector.MainPage_Link_User_Logout)) {
        
        console.log("Hompage Displayed")

      }
      else {
        assert.fail("Loginfailed")
      }

    }
    catch (error) {
      assert.fail("Loginfailed" + error)

    }


  }
  
//async  getPDFContents(pdfFilePath: string): Promise<any> {
  async  getPDFContents(strvalidate :any) {
    const fs = require('fs');
//const parser = new xml2js.Parser({ attrkey: "ATTR" });

// this example reads the file synchronously
// you can read it asynchronously also
//let xml_string = fs.readFileSync("./testdata/Invoice.xml", "utf8");
 // let pdfContents = fs.readFileSync('D://EDI/testdata//pdf_sample.pdf')
 // const PDFParser = require('pdf-parse');
 


  const buffer = fs.readFileSync(process.env.PATH_VAL+"//testdata//pdf_sample.pdf");
  const buffer1 = fs.readFileSync(process.env.PATH_VAL+"//testdata//pdf_sample.pdf");
 // const data = await PdfParse(buffer);
        try {
            const data = await pdfParse(buffer);
            const data1 = await pdfParse(buffer1);
            console.log(expect(data.text).to.include(data1.text))
            
            console.log(data.numpages);
            console.log(data.version);
    // PDF text
    console.log(data.metadata); 

            //return data.numpages;
            
          //  console.log(data.text);
           console.log(expect(data.text).to.include(strvalidate))
               
        } catch (err) {
            //throw new Error(err);
        }
        
 /*/ pdfContents(PDFParser).then(function(data:any) {
 
    // number of pages
    
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);
    // PDF text
    console.log(data.text); 
        
});*/
/*  expect(pdfContents.Meta.Keywords, 'PDF keyword was incorrect').equal('Standard Fees and Charges, 003-750, 3-750');
  const rawText = pdfContents.Pages[0].Texts[3].R[0].T
  expect(pdfContents.Pages.length, 'The pdf should have 6 pages').equal(6);
  expect(decodeURI(rawText), 'The subheading text was incorrect').equal('When we may charge fees');
  //const fs = require('fs');
//const PDFParser = require('pdf-parse');
  let pdfParser = new PDFParser();
  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', (errData: { parserError: any }) =>
      reject(errData.parserError)
    );
    pdfParser.on('pdfParser_dataReady', (pdfData:any) => {
      resolve(pdfData);
    });

    //pdfParser.loadPDF(pdfFilePath);
  });*/
}



public async  DataNode() {
    
  try{
  
      let Datanode :any 
      const fs = require("fs");
      
      //
      
      const path = "D:/EDI/testdata/testdata_Goibibo.json";
      fs.readFile(path, "utf8", (error:any, jsonString:any) => {
        if (error) {
            console.log("Error reading the JSON file:", error);
            return;
        }

        try {
            const purchase_hist = JSON .parse(jsonString);
            for (var key in purchase_hist) {
              console.log(key);
              if(key=="Create_Invoice")
                 //Datanode : any
                Datanode = testdata["TC_02_Flights_SearchFlightDetails"]
              //return Datanode
              console.log(key);
            console.log(purchase_hist[key]);
             
          }
            


        } catch (error) {
            console.log("Error parsing JSON string:", error);
        }
    });
    return Datanode
  } catch (error) {
    console.log("Error parsing JSON string:", error);
}

}

}
