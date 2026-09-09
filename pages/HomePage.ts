//@author :Suneetha K
import dotenv from 'dotenv';
dotenv.config({ override: true })     
//mport test = require("../Lib/utils") 
   
import StartPageSelector from "../selectors/StartPageSelectors.json";   
import HomePageSelectors from "../selectors/Homepage_Selectors.json";  
import { WebActions } from '../Lib/WebActions'
import { Page, expect } from '@playwright/test';
import { assert } from "chai";     
// Adjust the path as needed

/**
 * Represents the Home Page of the application and provides methods to interact with and validate UI elements
 * using Playwright. Inherits from {@link WebActions} to leverage common web automation actions.
 *
 * @remarks
 * This class encapsulates actions and validations specific to the Home Page, such as clicking menu items,
 * validating radio buttons, verifying user login, and entering flight search details.
 *
 * @example
 * ```typescript
 * const homePage = new HomePage(page);
 * await homePage.clickMenuAndValidate('Flights', '/flights', 'Flight Search');
 * await homePage.validateRadioButtonsOnPage('Round Trip');
 * await homePage.Validate_BasicUser_Login('testuser');
 * await homePage.enterFlightSearchDetails('New York', 'London', '2024-07-01', 2, '2024-07-10');
 * ```
 *
 * @param page - The Playwright Page object representing the browser page instance.
 */
export  class HomePage extends WebActions {
  /**
   * The Playwright Page object representing the browser page instance.
   * Used to interact with and automate actions on the web page.
   */
  page: Page
  test: WebActions

  constructor( page: Page) {

    super(page);
    this.page = page    
    this.test=new WebActions(page);
    
  }
 

  public async clickMenuAndValidate(menu_item: string, expected_url: string, expected_title: string) {
  
  try {
    // Validate the menu item exists and is visible
    // Build a dynamic XPath for the menu item text
   
    const menuSelector = `//span[text()='${menu_item}']`;
    this.test.getText(this.page, menuSelector);
    //const menuSelector :any= await this.page.getByRole('link', { name: menu_item, exact: true });
    //const menuSelector1:any = await this.page.locator("//span[text()='Flights']")
    console.log("menuSelector"+menuSelector)       
    const isVisible = await this.page.isVisible(menuSelector);
    expect(isVisible).toBeTruthy();

    // Click on the menu item
    if (await this.page.$(menuSelector)) {
      await this.page.click(menuSelector);
      console.log
    } else {
      throw new Error(`Menu selector "${menuSelector}" not found`);
    }
    await this.page.waitForTimeout(5000); 
    // Wait for navigation
    await this.page.waitForURL('**', { waitUntil: "load" });

   
    const pages = this.page.context().pages();
    let targetPage = this.page;
    if (pages.length > 1) {
      // Assume the last opened page is the new tab
      targetPage = pages[pages.length - 1];
      await targetPage.bringToFront();
      await targetPage.waitForLoadState('load');
      await this.page.waitForTimeout(5000);
    }

    // Move back to the previous page if needed
     // Validate the URL and title
    const [currentUrl, pageTitle] = await Promise.all([
      this.page.url(),
      this.page.title()
    ]);
    expect(currentUrl).toContain(expected_url);
    expect(pageTitle).toContain(expected_title);
    // Handle case where menu opens in a new tab
    const [finalUrl, finalTitle] = await Promise.all([
      targetPage.url(),
      targetPage.title()
    ]);
 
    if (finalUrl.includes(expected_url) && finalTitle.includes(expected_title)) {
      //await this.attach(await this.page.screenshot(), 'image/png');
      //await this.attach(`Menu item "${menu_item}" clicked and validated successfully`, 'text/plain');
      return true;
    }
    if (pages.length > 1) {
      // Go back to the original page (first page in the context)
      await pages[0].bringToFront();
      await pages[0].waitForLoadState('load');
      await this.page.waitForTimeout(5000);
      // Perform click on the first page (original page)
      //await pages[0].click(menuSelector);
      // Navigate to home page
      await pages[0].goto(process.env.HOME_PAGE_URL || '/');
    }
    return false;
    } catch (error) {
    //await this.attach(await this.page.screenshot({ timeout: 90000 }), 'image/png');
    
    assert.fail(`Failed to click or validate menu item "${menu_item}": ${error}`);
  
  }
  }
public async validateRadioButtonsOnPage(radioButtonName: string) {
    let allValid = true;
    
      try {
      const radioButtonSelector = `//*[text()='${radioButtonName}']/parent::li/span`;

      // Check if the radio button is visible
      const isRadioButtonVisible = await this.page.isVisible(radioButtonSelector);
      if (!isRadioButtonVisible) {
        allValid = false;
        assert.fail(`Radio button "${radioButtonName}" is not visible`);
      }
      expect(isRadioButtonVisible).toBeTruthy();

      // Check if the radio button is enabled (clickable)
      const isRadioButtonEnabled = await this.page.locator(radioButtonSelector).isEnabled()
      await this.page.locator(radioButtonSelector).click()

      if (!isRadioButtonEnabled) {
        allValid = false;
        assert.fail(`Radio button "${radioButtonName}" is not enabled`);
      }
      expect(isRadioButtonEnabled).toBeTruthy();
      } catch (error) {
      allValid = false;
      assert.fail(`Exception while validating radio button "${radioButtonName}": ${error}`);
      }
    
    return allValid;
}
  public async Validate_BasicUser_Login(User:any) {
  try {
    //let TestNode :any
    //TestNode= this.ui.ActionsP.GetTestData()  
      //var TestNode = testdata['Create_Invoice']   
      //await this Loginpage.LaunchApplication()
      if (await this.page.locator(StartPageSelector.MainPage_WebElement_UserId).isVisible) {
        var OutputText_val:any
        OutputText_val=await this.test.getText(this.page,StartPageSelector.MainPage_WebElement_UserId)
         if(OutputText_val==User)
         console.log("Basic User details displayed")
        }
         
        else
        {
          console.log("Basic User  not displayed")
          
        }
     
   
    }
    catch (error) {
      assert .fail("Basic User validation Failed" + error)

    }
  }

public async enterFlightSearchDetails(fromCity: string, toCity: string, departureDate: string, passengers: number, returnDate?: string) {
  try {
    //const { fromCity, toCity, departureDate, returnDate, passengers } 
    console.log("fromCity:", fromCity);
    console.log("toCity:", toCity);
    console.log("departureDate:", departureDate);
    console.log("returnDate:", returnDate);
    console.log("passengers:", passengers);

    // Define selectors as variables
    console.log("departureDate"+departureDate)
    console.log("returnDate"+returnDate)
    console.log("passengers"+passengers)
    const fromCitySelector = HomePageSelectors.fromCitySelector;
    const fromcityselector_lable = HomePageSelectors.fromcityselector_lable;
    const toCitySelector_lable= HomePageSelectors.toCitySelector_lable;
    console.log("toCitySelector_lable"+toCitySelector_lable)
    const toCitySelector = HomePageSelectors.toCitySelector;
    //const departureDateSelector = HomePageSelectors.departureDateSelector;
    //const returnDateSelector = HomePageSelectors.returnDateSelector;
    //const passengersSelector = HomePageSelectors.passengersSelector;
    const searchFlightsButtonSelector = HomePageSelectors.searchFlightsButtonSelector;

    // Check visibility of selectors before interacting
    if ((await this.page.isVisible(fromcityselector_lable))) {
      await this.page.locator(fromcityselector_lable).click()
      await this.page.waitForTimeout(2000);
      const fromInput = this.page.locator(fromCitySelector)
      await fromInput.press('Control+A')
      await fromInput.press('Backspace')
      console.log("fromCitySelector"+fromCitySelector)
      await this.page.waitForSelector(fromCitySelector, { state: 'visible' })
      await fromInput.fill(fromCity)
      
      //await  test.ifill(this.page, fromCitySelector, fromCity);
      await this.page.waitForTimeout(3000);

      await this.page.waitForSelector(`li:has-text("${fromCity}")`,{ state: 'visible' })
      // Wait for dropdown suggestion list and select the correct option
      const suggestionItem = this.page.locator(`li:has-text("${fromCity}")`).first()
      await suggestionItem.waitFor({ timeout: 5000 })
      await suggestionItem.click()

      await this.page.waitForTimeout(1000)
    }
      else
    
      {
        throw new Error(`From City selector "${fromcityselector_lable}" is not visible`);
      }
      if ((await this.page.isVisible(toCitySelector))) {
        // Enter "To City"
        //await this.page.locator(toCitySelector_lable).click()
        await this.page.waitForTimeout(3000);
        await this.page.locator(toCitySelector).click()
        await this.page.waitForTimeout(2000);
        await this.page.locator(toCitySelector).press('Control+A');
await this.page.locator(toCitySelector).press('Backspace');
        await this.page.locator(toCitySelector).fill( toCity,{timeout:5000});
          await this.page.waitForTimeout(3000);
        console.log("toCitySelector"+toCitySelector)
        await this.page.waitForSelector(`li:has-text("${toCity}")`, { timeout: 5000 });
      const suggestion = this.page.locator(`li:has-text("${toCity}")`).first();
      await suggestion.waitFor({ timeout: 5000 });
      await suggestion.click();

      }
      else
      {
        throw new Error(`To City selector "${toCitySelector}" is not visible`);
      }
      
      await this.page.click(searchFlightsButtonSelector);
      await this.page.waitForTimeout(5000);

      return true;
    }
    // If fromcityselector_lable is not visible, return false
  catch (error) {
    console.error("Error in enterFlightSearchDetails:", error);
    assert.fail("Error in enterFlightSearchDetails:", error);
    return false;
  }
}
}                    


