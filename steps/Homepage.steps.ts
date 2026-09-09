//import { IWorldOptions, setWorldConstructor, World, IWorld } from '@cucumber/cucumber';

//const { expect } = require('@playwright/test');
import { HomePage } from '../pages/HomePage'
//@ Autor :Suneetha K
import { When, Then } from '@cucumber/cucumber';
import { assert } from 'chai';
import HomePageSelectors from "../selectors/Homepage_Selectors.json";  
//import { Page } from 'playwright';
//import { WebActions } from '../Lib/WebActions';
//import   HomepageSelectors from "../pages/Homepage_Selectors.json";
//import   testdata from "../testdata/testdata_Goibibo.json"



 When('I validate the following header menu links:', async function (dataTable) {
    const Homepage = new HomePage(this.page);
   
  const links = dataTable.hashes();

  for (const { menu_item, expected_url, expected_title } of links) {
    const result = await Homepage?.clickMenuAndValidate(menu_item, expected_url, expected_title);

    // Attach screenshot for reporting


    // Condition-based assertion for both positive and negative cases
    if (result) {
      assert.isTrue(result, `Successfully navigated to ${expected_url} with title containing ${expected_title}`);
      await this.attach(`Successfully navigated to ${expected_url} with title containing ${expected_title}`,'text/plain');
          await this.attach(await this.page?.screenshot(), 'image/png');
    } else {
      assert.isFalse(result, `Failed to navigate to ${expected_url} or title did not match ${expected_title}`);
      await this.attach(`Failed to navigate to ${expected_url} or title did not match ${expected_title}`,'text/plain');
          await this.attach(await this.page?.screenshot(), 'image/png');
    }
  }
}
);
        
When('I click on the {string} menu link it Should be redirected to respective page', async function (string, dataTable) {   
        const menuLinks = dataTable.hashes(); // Convert the data table into an array of objects
         console.log("string",string)    
        const Homepage = new HomePage(this.page);
        for (const { menu_item, expected_url, expected_title } of menuLinks) {
           
            
            const result = await Homepage?.clickMenuAndValidate(menu_item, expected_url, expected_title);

    // Attach screenshot for reporting
    //await this.attach(await this.page?.screenshot(), 'image/png');

    // Condition-based assertion for both positive and negative cases
    if (result) {
      assert.isTrue(result, `Successfully navigated to ${expected_url} page with title containing ${expected_title}`);
      await this.attach(`Successfully navigated to ${expected_url} page with title containing ${expected_title}`,'text/plain');
      await this.attach(await this.page?.screenshot(), 'image/png');
    } else {
      assert.isFalse(result, `Failed to navigate to ${expected_url} or title did not match ${expected_title}`);
      await this.attach(await this.page?.screenshot(), 'image/png');
      await this.attach(`Failed to navigate to ${expected_url} or title did not match ${expected_title}`,'text/plain');
    }
        }
    }
);

Then(  'I should see the following radio buttons on the Flights Booking page and they should be clickable',  async function (dataTable) {
    const radioButtonNames = dataTable.hashes(); // Convert the data table into an array of objects

    const Homepage = new HomePage(this.page);
    for (const { field_name } of radioButtonNames) {
      try {
        const result = await Homepage?.validateRadioButtonsOnPage(field_name);

        if (result) {
          assert.isTrue(result, `Radio button "${field_name}" is visible on the Flights Booking page and it is clickable.`);
          await this.attach(`Radio button "${field_name}" is visible on the Flights Booking page and it is clickable.`, 'text/plain');
          await this.attach(await this.page?.screenshot(), 'image/png');
        } else {
          assert.isFalse(result, `Radio button "${field_name}" is NOT visible on the Flights Booking page and it is NOT clickable.`);
          await this.attach(`Radio button "${field_name}" is NOT visible on the Flights Booking page and it is NOT clickable.`, 'text/plain');
          await this.attach(await this.page?.screenshot(), 'image/png');
        }
      } catch (error) {
        await this.attach(`Exception occurred while validating radio button "${field_name}": ${error}`, 'text/plain');
        await this.attach(await this.page?.screenshot(), 'image/png');
        throw error;
      }
    }
  }
);

Then('I select the {string} radio button',  async function (radioButtonName) {
    const Homepage = new HomePage(this.page);
    try {
      const result = await Homepage?.validateRadioButtonsOnPage(radioButtonName);

        if (result) {
          assert.isTrue(result, `Radio button "${radioButtonName}" is selected successfully on the Flights Booking page.`);
          await this.attach(`Radio button "${radioButtonName}" is selected successfully on the Flights Booking page.`, 'text/plain');
          await this.attach(await this.page?.screenshot(), 'image/png');
        } else {
          assert.isFalse(result, `Failed to select radio button "${radioButtonName}" on the Flights Booking page.`);
          await this.attach(`Failed to select radio button "${radioButtonName}" on the Flights Booking page.`, 'text/plain');
          await this.attach(await this.page?.screenshot(), 'image/png');
        }
            } catch (error) {
        await this.attach(`Exception occurred while selecting radio button "${radioButtonName}": ${error}`, 'text/plain');
        await this.attach(await this.page?.screenshot(), 'image/png');
        throw error;
      }
    }
  
);

Then('I search for flights with the following details',
    async function (dataTable) {
      const flightDetails = dataTable.hashes(); // Get the first row of the data table
      const Homepage = new HomePage(this.page);

   for (const {From_City, To_City, Departure_Date, Passengers, Return_Date} of flightDetails) {
      try {
        // Call the method to enter flight search details
        console.log("FromCity",From_City,"ToCity",To_City,"DepartureDate",Departure_Date,"Passengers",Passengers,"ReturnDate",Return_Date)
    const result = await Homepage?.enterFlightSearchDetails(From_City, To_City, Departure_Date, Passengers, Return_Date);

        if (result === undefined) {
          assert.fail('enterFlightSearchDetails did not return a value. Please ensure it returns a boolean.');
        } else if (result) {
          assert.isTrue(result, 'Flight search details entered successfully.');
          await this.attach('Flight search details entered successfully.', 'text/plain');
          await this.attach(await this.page?.screenshot(), 'image/png');
        } else {
         
          await this.attach('Failed to enter flight search details.', 'text/plain');
          await this.attach(await this.page?.screenshot(), 'image/png');
           assert.fail('Failed to enter flight search details.');
        }

      } catch (error) {
        await this.attach(`Exception occurred while entering flight search details: ${error}`, 'text/plain');
        await this.attach(await this.page?.screenshot(), 'image/png');
        
         assert.fail('Failed to enter flight search details.');
       
      }
    }
  }
);



Then(
  'I should see the search results for Flights for the specified route',
  async function (dataTable) {
    const [{ From_City, To_City }] = dataTable.hashes();

    try {
      // Wait for the search results section to appear
      await this.page.waitForSelector(HomePageSelectors.Search_Flight_Details_Label);

      // Validate that the search results are visible
      const isSearchResultsVisible = await this.page.isVisible(HomePageSelectors.Search_Flight_Details_Label);
      if (isSearchResultsVisible) {
        assert.isTrue(isSearchResultsVisible, 'Search results are visible.');
        await this.attach('Search results are visible.', 'text/plain');
      } else {
        assert.isFalse(isSearchResultsVisible, 'Search results are not visible.');
        await this.attach('Search results are not visible.', 'text/plain');
        await this.attach(await this.page?.screenshot(), 'image/png');
        return;
      }

      // Validate that the search results contain the specified route
      const routeText = await this.page.textContent(HomePageSelectors.Search_Flight_Details_Label);
      const expectedRoute = `${From_City} to ${To_City}`;
      if (routeText && routeText.includes(expectedRoute)) {
        assert.include(routeText, expectedRoute, `Search results contain the expected route: ${expectedRoute}`);
        // Successfully validated the expected route in search results
        await this.attach(`Search results contain the expected route: ${expectedRoute}`, 'text/plain');
        await this.attach(await this.page?.screenshot(), 'image/png');
      } else {
       
        await this.attach(`Search results do not contain the expected route: ${expectedRoute}`, 'text/plain');
        await this.attach(await this.page?.screenshot(), 'image/png');
         assert.fail(`Search results do not contain the expected route: ${expectedRoute}`);
      }
    } catch (error) {
      await this.attach(`Exception occurred while validating search results: ${error}`, 'text/plain');
      await this.attach(await this.page?.screenshot(), 'image/png');
      assert.fail(`Exception occurred while validating search results: ${error}`);
    }
  }
);
Then('I close the application', async function () {
           // Write code here that turns the phrase above into concrete actions
           console.log("Closing the application");
         });