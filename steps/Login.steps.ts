//@autor:Suneetha K

import { Given, Then } from '@cucumber/cucumber';
import { assert } from 'chai';
import   LoginSelector from "../selectors/CommonSelectors.json";
import   StartPageSelectors from "../selectors/StartPageSelectors.json";
import { LoginPage } from '../pages/LoginPage'
import { WebActions } from '../Lib/WebActions'


Given('Launching Application', async function (){ 

  // Write code here that turns the phrase above into concrete action 
  try{  const Loginpage = new LoginPage(this.page);   
       const output=  await Loginpage?.LaunchApplication()
       if(output==true)
        { await this.attach(await this.page.screenshot({timeout:90000}), 'image/png');
        await this.attach("Application Launched Successfully", 'text/plain') 
        }
        else
        {
          this.attach("Application Failed to Launch", 'text/plain')
          assert.fail( "Application Failed to Launch")
        }  
  }
  catch(error){
    await this.attach(await this.page.screenshot({timeout:90000}), 'image/png');
  
        assert.fail( "Application Not Launched "+ error)
  }   
});
Then('Login as {string}', async function (String) {
  // Write code here that tutry{  
 try{ const Loginpage = new LoginPage(this.page);
      
      await Loginpage?.LoginToApplication(String)      
      await this.page.screenshot(), 'image/png'
      await this.page.click(LoginSelector.Submit)
     
      let data={
        Username : process.env.USER_NAME,
        Password : "*********"
  }
  this.attach("User Details:"+JSON.stringify(data, null, 2))

}
catch(error)   {
    
    await this.attach(await this.page.screenshot({timeout:90000}), 'image/png');
    assert.fail( " Login failed "+ error)
}
//await page.keyboard.press('Enter');
});

Then('Validate Home Page', async function () {
  // Write code here that turns the phrase above into concrete actions
 try{ const Loginpage = new LoginPage(this.page);
       
       const test =new WebActions(this.page) 
       
    await Loginpage?.ValidateHomePage()
    var SearchTiltle = await test.getText(this.page,StartPageSelectors.MainPage_WebElement_Home_SearchTitle)
   // this.attach("HomePage Displayed")
    if(SearchTiltle.trim()=="Domestic and International Flights")

    {
               console.log("Home Page displayed on Launching the application "+ SearchTiltle)
               this.attach ("Home Displayed on Launch Launching the application with Tiltle ::"+ SearchTiltle,'text/plain')
    }
    else
    {
      console.log("Home Page Failed to display on Launching the application "+ SearchTiltle)
      this.attach("Home Page Failed to display on Launching the application "+ SearchTiltle)
      assert.fail( "Home Page Failed to display on Launching the application "+ SearchTiltle)
    }
    
    
    await this.attach(await this.page?.screenshot(), 'image/png');
 }
 catch(error)
{   await this.attach(await this.page.screenshot({timeout:90000}), 'image/png');
    assert.fail( "Home Page Not Displayed"+ error)
  

 }

});
