import { Given, Then, When } from '@cucumber/cucumber';
import { assert } from 'chai';
import { GajabLoginPage } from '../pages/GajabLoginPage';

const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return `${error.message}${error.stack ? `\n${error.stack}` : ''}`;
  }
  return String(error);
};

const failStep = async (world: any, stepMessage: string, error: unknown) => {
  const details = formatError(error);
  try {
    await world.attach(`${stepMessage}: ${details}`, 'text/plain');
  } catch {
    // Ignore report attachment errors and fail with original details.
  }
  try {
    const screenshot = await world.page.screenshot();
    await world.attach(screenshot, 'image/png');
  } catch {
    // Ignore screenshot errors in failure path.
  }
  assert.fail(`${stepMessage}: ${details}`);
};

const runStep = async (world: any, successMessage: string, action: (page: GajabLoginPage) => Promise<string[]>) => {
  try {
    const gajab = new GajabLoginPage(world.page);
    const details = await action(gajab);
    await world.attach(successMessage, 'text/plain');
    for (const detail of details) {
      await world.attach(detail, 'text/plain');
    }
    await world.attach(await world.page.screenshot(), 'image/png');
  } catch (error) {
    await failStep(world, successMessage.replace('completed', 'failed'), error);
  }
};

Given('I launch Gajab application sign-in page', async function () {
  await runStep(this, 'Launch sign-in page completed.', async (gajab) => {
    return gajab.launchSignInPage();
  });
});

When('I select {string} language in sign-in form', async function (language: string) {
  await runStep(this, `${language} language selection completed.`, async (gajab) => {
    return gajab.selectLanguageBeforeLogin(language);
  });
});

When('I enter mobile number in sign-in form', async function () {
  await runStep(this, 'Enter mobile number completed.', async (gajab) => {
    return gajab.enterMobileNumber();
  });
});

Then('I accept age confirmation and terms in sign-in form', async function () {
  await runStep(this, 'Accept terms completed.', async (gajab) => {
    return gajab.acceptTermsAndAgeConfirmation();
  });
});

Then('I should see sign-in terms selected', async function () {
  await runStep(this, 'Sign-in terms validation completed.', async (gajab) => {
    return gajab.validateTermsSelected();
  });
});

Then('I explore deal of the day and trending products', async function () {
  await runStep(this, 'Deal of the day exploration completed.', async (gajab) => {
    return gajab.exploreDealAndTrendingProducts();
  });
});

Then('I browse widget and toys listing flow', async function () {
  await runStep(this, 'Widget and toys flow completed.', async (gajab) => {
    return gajab.browseWidgetAndToysListingFlow();
  });
});

Then('I perform bargain checkout and payment flow', async function () {
  await runStep(this, 'Bargain checkout and payment flow completed.', async (gajab) => {
    return gajab.performBargainCheckoutAndPaymentFlow();
  });
});

Then('I verify order confirmation and revisit bargain product', async function () {
  await runStep(this, 'Order confirmation verification completed.', async (gajab) => {
    return gajab.verifyOrderConfirmationAndRevisitBargainProduct();
  });
});
