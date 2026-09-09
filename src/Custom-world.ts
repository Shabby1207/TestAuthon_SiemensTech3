import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
//import { ICreateAttachment } from '@cucumber/cucumber/lib/runtime/attachment_manager';
import * as messages from '@cucumber/messages';
import { BrowserContext, Page, PlaywrightTestOptions, APIRequestContext, Browser } from '@playwright/test';

/*export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export interface ICustomWorld extends World {
  debug: boolean;
  context?: BrowserContext;
  page?: Page;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
  debug = false;
}

setWorldConstructor(CustomWorld);
*/


export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export interface ICustomWorld extends World {
  debug: boolean;
  feature?: messages.Pickle;
  context?: BrowserContext;
  browser?: Browser;
  page?: Page;
  tracingStarted?: boolean; 

  testName?: string;
  startTime?: Date;

  server?: APIRequestContext;

  playwrightOptions?: PlaywrightTestOptions;
  
  
  
}

export class CustomWorld extends World implements ICustomWorld {
 
  constructor(options: IWorldOptions) {
    super(options);
    
  }
  debug = false;
}

setWorldConstructor(CustomWorld)