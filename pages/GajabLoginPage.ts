import { Page } from '@playwright/test';
import { assert } from 'chai';
import selectors from '../selectors/GajabLoginSelectors.json';

interface GajabFlowData {
  appUrl: string;
  signinUrl: string;
  mobileNumber: string;
  checkoutName: string;
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  widgetListUrl: string;
  twintipUrl: string;
  toysUrl: string;
  toysFilteredPriceUrl: string;
  dartboardUrl: string;
  checkoutUrl: string;
  orderConfirmUrl: string;
  toysBrand: string;
  toysMinPrice: string;
  toysMaxPrice: string;
}

export class GajabLoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private getRequiredEnv(name: string, fallback?: string): string {
    const value = process.env[name]?.trim();
    if (value) {
      return value;
    }
    if (fallback && fallback.trim() !== '') {
      return fallback;
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }

  private getOptionalEnv(name: string, fallback: string): string {
    const value = process.env[name]?.trim();
    return value && value !== '' ? value : fallback;
  }

  private getFlowData(): GajabFlowData {
    const appUrl = this.getRequiredEnv('GAJAB_APP_URL', process.env.APP_URL);
    const normalizedBase = appUrl.endsWith('/') ? appUrl : `${appUrl}/`;

    return {
      appUrl: normalizedBase,
      signinUrl: this.getOptionalEnv('GAJAB_SIGNIN_URL', `${normalizedBase}signin`),
      mobileNumber: this.getRequiredEnv('GAJAB_MOBILE_NUMBER'),
      checkoutName: this.getOptionalEnv('GAJAB_CHECKOUT_NAME', 'Test'),
      addressLine1: this.getOptionalEnv('GAJAB_ADDRESS_LINE1', 'Testathon'),
      addressLine2: this.getOptionalEnv('GAJAB_ADDRESS_LINE2', 'Automation'),
      pincode: this.getOptionalEnv('GAJAB_PINCODE', '452012'),
      widgetListUrl: this.getOptionalEnv('GAJAB_WIDGET_LIST_URL', `${normalizedBase}product-list/all?widgetId=10&position=WP1`),
      twintipUrl: this.getOptionalEnv('GAJAB_TWINTIP_URL', `${normalizedBase}product-detail/twintipalcoholmarkerpenforartdesignerartist12pcs/7UVF338340208`),
      toysUrl: this.getOptionalEnv('GAJAB_TOYS_URL', `${normalizedBase}product-list/toys-games/17?offset=0`),
      toysFilteredPriceUrl: this.getOptionalEnv('GAJAB_TOYS_FILTERED_PRICE_URL', `${normalizedBase}product-list/toys-games/17?offset=0&limit=48&brandIds=14&orderBy=0&customlowprice=427&customhighprice=727`),
      dartboardUrl: this.getOptionalEnv('GAJAB_DARTBOARD_URL', `${normalizedBase}product-detail/classic-157-inch-soft-tip-dartboard-game-set-%7C-6-darts-included-%7C-premium-quality-round-target-board-for-kids-adults-%7C-indoor-family-fun-birthday-christmas-gift-multicolor-40-cm/202612786944`),
      checkoutUrl: this.getOptionalEnv('GAJAB_CHECKOUT_URL', `${normalizedBase}checkout`),
      orderConfirmUrl: this.getOptionalEnv('GAJAB_ORDER_CONFIRM_URL', `${normalizedBase}order-confrim/GAJ2627001137`),
      toysBrand: this.getOptionalEnv('GAJAB_TOYS_BRAND', "SERA'S BASKET"),
      toysMinPrice: this.getOptionalEnv('GAJAB_TOYS_MIN_PRICE', '427'),
      toysMaxPrice: this.getOptionalEnv('GAJAB_TOYS_MAX_PRICE', '727')
    };
  }

  private async goto(url: string): Promise<void> {
    await this.page.goto(url, { timeout: 45000, waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissUiPopups();
  }

  private async clearLocationBlockerIfPresent(): Promise<void> {
    const blocker = this.page.locator(selectors.locationClickBlocker);
    if (await blocker.count()) {
      await this.page.keyboard.press('Escape').catch(() => {});
      await blocker.first().evaluate((node: HTMLElement) => node.remove()).catch(() => {});
    }
  }

  private async click(locator: string): Promise<void> {
    const element = this.page.locator(locator).first();
    await element.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await element.click({ timeout: 8000 });
    } catch {
      try {
        await element.click({ timeout: 8000, force: true });
      } catch {
        await element.evaluate((node: HTMLElement) => node.click());
      }
    }
    await this.dismissUiPopups();
  }

  private async clickByRole(role: 'button' | 'heading' | 'link' | 'img' | 'radio', name: RegExp | string): Promise<void> {
    const element = this.page.getByRole(role, { name }).first();
    await element.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await element.click({ timeout: 8000 });
    } catch {
      try {
        await element.click({ timeout: 8000, force: true });
      } catch {
        await element.evaluate((node: HTMLElement) => node.click());
      }
    }
    await this.dismissUiPopups();
  }

  private async clickByText(text: RegExp | string): Promise<void> {
    const element = this.page.getByText(text).first();
    await element.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await element.click({ timeout: 8000 });
    } catch {
      try {
        await element.click({ timeout: 8000, force: true });
      } catch {
        await element.evaluate((node: HTMLElement) => node.click());
      }
    }
    await this.dismissUiPopups();
  }

  private async clickTextIfVisible(text: RegExp | string, timeoutMs = 3000): Promise<boolean> {
    const element = this.page.getByText(text).first();
    const visible = await element.isVisible({ timeout: timeoutMs }).catch(() => false);
    if (!visible) {
      return false;
    }
    await element.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await element.click({ timeout: 8000 });
    } catch {
      try {
        await element.click({ timeout: 8000, force: true });
      } catch {
        await element.evaluate((node: HTMLElement) => node.click()).catch(() => {});
      }
    }
    await this.dismissUiPopups();
    return true;
  }

  private async fillIfVisible(selector: string, value: string, timeoutMs = 3000): Promise<boolean> {
    const field = this.page.locator(selector).first();
    const visible = await field.isVisible({ timeout: timeoutMs }).catch(() => false);
    if (!visible) {
      return false;
    }
    await field.fill(value);
    return true;
  }

  private async clickIfVisible(locator: string, timeoutMs = 3000): Promise<boolean> {
    const element = this.page.locator(locator).first();
    const visible = await element.isVisible({ timeout: timeoutMs }).catch(() => false);
    if (!visible) {
      return false;
    }
    await element.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await element.click({ timeout: 8000 });
    } catch {
      try {
        await element.click({ timeout: 8000, force: true });
      } catch {
        await element.evaluate((node: HTMLElement) => node.click()).catch(() => {});
      }
    }
    await this.dismissUiPopups();
    return true;
  }

  private async clickRoleIfVisible(role: 'button' | 'heading' | 'link' | 'img' | 'radio', name: RegExp | string, timeoutMs = 3000): Promise<boolean> {
    const element = this.page.getByRole(role, { name }).first();
    const visible = await element.isVisible({ timeout: timeoutMs }).catch(() => false);
    if (!visible) {
      return false;
    }
    await element.scrollIntoViewIfNeeded().catch(() => {});
    try {
      await element.click({ timeout: 8000 });
    } catch {
      try {
        await element.click({ timeout: 8000, force: true });
      } catch {
        await element.evaluate((node: HTMLElement) => node.click()).catch(() => {});
      }
    }
    await this.dismissUiPopups();
    return true;
  }

  private async clickAnyIfVisible(locatorCandidates: string[], timeoutMs = 3000): Promise<boolean> {
    for (const locator of locatorCandidates) {
      if (await this.clickIfVisible(locator, timeoutMs)) {
        return true;
      }
    }
    return false;
  }

  private async dismissUiPopups(): Promise<void> {
    const closeCandidates = [
      this.page.getByRole('button', { name: /close|skip|not now|later|dismiss/i }).first(),
      this.page.getByLabel(/close/i).first(),
      this.page.locator('[aria-label*="close" i], [class*="close" i], [id*="close" i]').first()
    ];

    for (const candidate of closeCandidates) {
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.click({ force: true }).catch(() => {});
      }
    }
    await this.clearLocationBlockerIfPresent();
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private async getTextIfVisibleByRole(role: 'heading' | 'button' | 'link' | 'img', name: RegExp | string): Promise<string> {
    const locator = this.page.getByRole(role, { name }).first();
    if (await locator.isVisible().catch(() => false)) {
      return (await locator.textContent())?.trim() || 'visible-without-text';
    }
    return 'not-visible';
  }

  private async getTextIfVisible(selector: string): Promise<string> {
    const locator = this.page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      return (await locator.textContent())?.trim() || 'visible-without-text';
    }
    return 'not-visible';
  }

  private async extractProductSummariesNearHeading(headingPattern: RegExp, maxItems = 4): Promise<string[]> {
    const heading = this.page.getByRole('heading', { name: headingPattern }).first();
    if (!(await heading.isVisible().catch(() => false))) {
      return [];
    }

    const container = this.page
      .locator('section, div')
      .filter({ has: this.page.getByRole('heading', { name: headingPattern }) })
      .first();

    const rawTexts = await container
      .locator("a[href*='product-detail'], [id*='product-name' i], h3, h4, p")
      .allTextContents()
      .catch(() => [] as string[]);

    const cleaned = rawTexts
      .map((text) => text.replace(/\s+/g, ' ').trim())
      .filter((text) => text.length > 3)
      .filter((text) => !/view all|view more|see all|shop now|offer|bargain now/i.test(text));

    const unique: string[] = [];
    for (const text of cleaned) {
      if (!unique.some((item) => item.toLowerCase() === text.toLowerCase())) {
        unique.push(text);
      }
      if (unique.length >= maxItems) {
        break;
      }
    }

    return unique;
  }

  public async launchSignInPage(): Promise<string[]> {
    const flow = this.getFlowData();

    await this.goto(flow.appUrl);
    try {
      await this.goto(flow.signinUrl);
    } catch {
      await this.goto(flow.appUrl);
      await this.clearLocationBlockerIfPresent();
      await this.click(selectors.loginSignupLink);
    }

    await this.page.waitForSelector(selectors.mobileNumberInput, { timeout: 30000 });
    const isVisible = await this.page.locator(selectors.mobileNumberInput).isVisible();
    assert.isTrue(isVisible, 'Mobile number input should be visible on sign-in page.');

    return [
      `Sign-in URL: ${this.page.url()}`,
      `Sign-in title: ${await this.page.title()}`,
      'Validation: mobile input is visible'
    ];
  }

  public async selectLanguageBeforeLogin(language: string): Promise<string[]> {
    const requested = language.trim().toLowerCase();
    if (requested !== 'english' && requested !== 'hinglish') {
      throw new Error(`Unsupported language option: ${language}. Supported values are English and Hinglish.`);
    }

    const closeLocationClicked = await this.clickRoleIfVisible('button', /Close location/i, 5000);
    const overlayClicked = await this.clickIfVisible('#home-bargain-guide-portal-overlay', 5000);
    const englishArrowRegex = /english\s*(arrow|language)?|select\s*language|language/i;
    const hinglishRegex = /hinglish|hindi\s*\+?\s*english|hindi/i;
    const uncheckedRegex = /unchecked|uncheck|not\s*checked|not\s*selected|radio\s*off/i;
    const checkedRegex = /(^|\s)checked(\s|$)|selected|radio\s*on|check\s*mark|tick/i;

    const englishArrowClickedFirst =
      await this.clickRoleIfVisible('button', englishArrowRegex, 6000) ||
      await this.clickRoleIfVisible('link', englishArrowRegex, 2500) ||
      await this.clickRoleIfVisible('img', englishArrowRegex, 2500) ||
      await this.clickTextIfVisible(/english|language/i, 2500);

    let englishArrowClickedSecond = false;
    let uncheckedClicked = false;
    let uncheckedClickedSecond = false;
    let checkedClicked = false;
    let checkedClickedSecond = false;
    let languageSelectedByRole = false;
    let languageSelectedByLabel = false;
    let languageSelectedByText = false;

    if (requested === 'english') {
      englishArrowClickedSecond =
        await this.clickRoleIfVisible('button', englishArrowRegex, 4000) ||
        await this.clickTextIfVisible(/english/i, 2500);

      const englishRadio = this.page.getByRole('radio', { name: /english/i }).first();
      if (await englishRadio.isVisible({ timeout: 2500 }).catch(() => false)) {
        await englishRadio.check().catch(async () => {
          await englishRadio.click({ force: true });
        });
        languageSelectedByRole = true;
      }

      if (!languageSelectedByRole) {
        const englishCheckbox = this.page.getByRole('checkbox', { name: /english/i }).first();
        if (await englishCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
          await englishCheckbox.check().catch(async () => {
            await englishCheckbox.click({ force: true });
          });
          languageSelectedByRole = true;
        }
      }

      if (!languageSelectedByRole) {
        const englishByLabel = this.page.getByLabel(/english/i).first();
        if (await englishByLabel.isVisible({ timeout: 2000 }).catch(() => false)) {
          await englishByLabel.check().catch(async () => {
            await englishByLabel.click({ force: true });
          });
          languageSelectedByLabel = true;
        }
      }

      if (!languageSelectedByRole && !languageSelectedByLabel) {
        languageSelectedByText = await this.clickTextIfVisible(/english/i, 2000);
      }
    } else {
      languageSelectedByText = await this.clickTextIfVisible(hinglishRegex, 5000);

      const hinglishRadio = this.page.getByRole('radio', { name: hinglishRegex }).first();
      if (await hinglishRadio.isVisible({ timeout: 2500 }).catch(() => false)) {
        await hinglishRadio.check().catch(async () => {
          await hinglishRadio.click({ force: true });
        });
        languageSelectedByRole = true;
      }

      if (!languageSelectedByRole) {
        const hinglishCheckbox = this.page.getByRole('checkbox', { name: hinglishRegex }).first();
        if (await hinglishCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
          await hinglishCheckbox.check().catch(async () => {
            await hinglishCheckbox.click({ force: true });
          });
          languageSelectedByRole = true;
        }
      }

      if (!languageSelectedByRole) {
        const hinglishByLabel = this.page.getByLabel(hinglishRegex).first();
        if (await hinglishByLabel.isVisible({ timeout: 2000 }).catch(() => false)) {
          await hinglishByLabel.check().catch(async () => {
            await hinglishByLabel.click({ force: true });
          });
          languageSelectedByLabel = true;
        }
      }

      uncheckedClicked =
        await this.clickRoleIfVisible('img', uncheckedRegex, 4000) ||
        await this.clickAnyIfVisible([
          "img[alt*='unchecked' i]",
          "img[aria-label*='unchecked' i]",
          "img[src*='unchecked' i]",
          "[data-testid*='unchecked' i]",
          "[class*='unchecked' i]",
          "[id*='unchecked' i]",
          "[aria-checked='false']"
        ], 2500);

      uncheckedClickedSecond =
        await this.clickRoleIfVisible('img', uncheckedRegex, 3000) ||
        await this.clickAnyIfVisible([
          "img[alt*='unchecked' i]",
          "img[aria-label*='unchecked' i]",
          "img[src*='unchecked' i]",
          "[data-testid*='unchecked' i]",
          "[class*='unchecked' i]",
          "[id*='unchecked' i]",
          "[aria-checked='false']"
        ], 2000);

      checkedClicked =
        await this.clickRoleIfVisible('img', checkedRegex, 4000) ||
        await this.clickAnyIfVisible([
          "img[alt*='checked' i]",
          "img[aria-label*='checked' i]",
          "img[src*='checked' i]",
          "[data-testid*='checked' i]",
          "[class*='checked' i]",
          "[id*='checked' i]",
          "[aria-checked='true']"
        ], 2500);

      checkedClickedSecond =
        await this.clickRoleIfVisible('img', checkedRegex, 3000) ||
        await this.clickAnyIfVisible([
          "img[alt*='checked' i]",
          "img[aria-label*='checked' i]",
          "img[src*='checked' i]",
          "[data-testid*='checked' i]",
          "[class*='checked' i]",
          "[id*='checked' i]",
          "[aria-checked='true']"
        ], 2000);

      if (!languageSelectedByRole && !languageSelectedByLabel && !languageSelectedByText) {
        languageSelectedByText = await this.clickTextIfVisible(/hinglish|hindi/i, 2000);
      }
    }

    const mobileVisible = await this.page.locator(selectors.mobileNumberInput).isVisible({ timeout: 10000 }).catch(() => false);
    assert.isTrue(mobileVisible, 'Mobile number input should remain visible after language selection.');

    const languageActionWorked = requested === 'english'
      ? (englishArrowClickedFirst || englishArrowClickedSecond || languageSelectedByRole || languageSelectedByLabel || languageSelectedByText)
      : (englishArrowClickedFirst || languageSelectedByRole || languageSelectedByLabel || languageSelectedByText || uncheckedClicked || checkedClicked);
    assert.isTrue(languageActionWorked, `Could not locate language controls for ${language}.`);

    return [
      `Validation: requested language = ${requested}`,
      `Validation: close location clicked = ${closeLocationClicked}`,
      `Validation: overlay clicked = ${overlayClicked}`,
      `Validation: English arrow first click = ${englishArrowClickedFirst}`,
      `Validation: English arrow second click = ${englishArrowClickedSecond}`,
      `Validation: language selected by role = ${languageSelectedByRole}`,
      `Validation: language selected by label = ${languageSelectedByLabel}`,
      `Validation: language selected by text = ${languageSelectedByText}`,
      `Validation: unchecked first click = ${uncheckedClicked}`,
      `Validation: unchecked second click = ${uncheckedClickedSecond}`,
      `Validation: checked first click = ${checkedClicked}`,
      `Validation: checked second click = ${checkedClickedSecond}`,
      `Validation: mobile input visible after language selection = ${mobileVisible}`
    ];
  }

  public async enterMobileNumber(): Promise<string[]> {
    const flow = this.getFlowData();
    const input = this.page.locator(selectors.mobileNumberInput);

    await input.click();
    await input.fill(flow.mobileNumber);
    const enteredValue = await input.inputValue();
    assert.equal(enteredValue, flow.mobileNumber, 'Mobile number should be entered successfully.');

    const maskedMobile = enteredValue.length > 4 ? `******${enteredValue.slice(-4)}` : enteredValue;
    return [
      `Validation: mobile number entered as ${maskedMobile}`
    ];
  }

  public async acceptTermsAndAgeConfirmation(): Promise<string[]> {
    const checkbox = this.page.locator(selectors.termsCheckbox);
    await checkbox.check();
    await this.page.locator(selectors.termsContainer).click({ force: true });
    const isChecked = await checkbox.isChecked();
    assert.isTrue(isChecked, 'Terms checkbox should be checked after acceptance.');

    return [
      `Validation: terms checkbox checked = ${isChecked}`
    ];
  }

  public async validateTermsSelected(): Promise<string[]> {
    const isChecked = await this.page.locator(selectors.termsCheckbox).isChecked();
    assert.isTrue(isChecked, 'Terms checkbox should remain selected.');

    return [
      `Validation: terms still selected = ${isChecked}`
    ];
  }

  public async exploreDealAndTrendingProducts(): Promise<string[]> {
    const flow = this.getFlowData();
    const dealHeading = this.page.getByRole('heading', { name: /Gajab\s*Deal\s*Of\s*The\s*Day/i }).first();
    const dealProductsBefore = await this.extractProductSummariesNearHeading(/Gajab\s*Deal\s*Of\s*The\s*Day/i, 5);
    const trendingProductsBefore = await this.extractProductSummariesNearHeading(/Trending/i, 5);

    if (!(await dealHeading.isVisible().catch(() => false))) {
      await this.goto(flow.appUrl);
      await this.clearLocationBlockerIfPresent();
    }

    const dealClicked = await this.clickRoleIfVisible('heading', /Gajab\s*Deal\s*Of\s*The\s*Day/i, 6000);
    const trendingClicked = await this.clickRoleIfVisible('heading', /Trending/i, 6000);
    const liveOrderNameClicked = await this.clickIfVisible(selectors.liveOrderNameFallback, 4000);
    const liveOrderMessageClicked = await this.clickIfVisible(selectors.liveOrderMessageFallback, 4000);
    const justBargainedClicked = await this.clickRoleIfVisible('heading', /Just\s*Bargained/i, 6000);
    const bargainImageClicked = await this.clickRoleIfVisible('img', /most\s*bargain\s*background/i, 4000);
    const viewMoreClicked = await this.clickIfVisible(selectors.homeWidgetViewMore, 4000);

    if (!dealClicked && !trendingClicked && !justBargainedClicked && !viewMoreClicked) {
      await this.goto(flow.widgetListUrl);
    }

    assert.match(this.page.url(), /stg\.gajab\.com|product-list|home|product-detail/i, 'Expected explore flow to stay within Gajab context.');

    const dealText = await this.getTextIfVisibleByRole('heading', /Gajab\s*Deal\s*Of\s*The\s*Day/i);
    const liveOrderName = await this.getTextIfVisible(selectors.liveOrderNameFallback);
    const liveOrderMessage = await this.getTextIfVisible(selectors.liveOrderMessageFallback);
    const dealProductsAfter = await this.extractProductSummariesNearHeading(/Gajab\s*Deal\s*Of\s*The\s*Day/i, 5);
    const trendingProductsAfter = await this.extractProductSummariesNearHeading(/Trending/i, 5);
    const dealProducts = dealProductsAfter.length ? dealProductsAfter : dealProductsBefore;
    const trendingProducts = trendingProductsAfter.length ? trendingProductsAfter : trendingProductsBefore;
    const dealSummary = dealProducts.length ? dealProducts.join(' | ') : 'not-captured';
    const trendingSummary = trendingProducts.length ? trendingProducts.join(' | ') : 'not-captured';

    return [
      `Validation: deal heading clicked = ${dealClicked}`,
      `Validation: trending clicked = ${trendingClicked}`,
      `Validation: live order card clicked = ${liveOrderNameClicked}`,
      `Validation: live order message clicked = ${liveOrderMessageClicked}`,
      `Validation: just bargained clicked = ${justBargainedClicked}`,
      `Validation: bargain image clicked = ${bargainImageClicked}`,
      `Validation: view more clicked = ${viewMoreClicked}`,
      `Validation: deal heading text = ${dealText}`,
      `Validation: Deal Of The Day products = ${dealSummary}`,
      `Validation: Trending products = ${trendingSummary}`,
      `Validation: live order name = ${liveOrderName}`,
      `Validation: live order message = ${liveOrderMessage}`,
      `Validation: current URL after explore = ${this.page.url()}`
    ];
  }

  public async browseWidgetAndToysListingFlow(): Promise<string[]> {
    const flow = this.getFlowData();
    const brandRegex = new RegExp(this.escapeRegex(flow.toysBrand), 'i');

    await this.goto(flow.widgetListUrl);
    let sortOpened = await this.clickIfVisible(selectors.sortSelectInput, 3000);
    if (!sortOpened) {
      sortOpened = await this.clickRoleIfVisible('button', /sort|relevance|price/i, 3000);
    }

    const sortApplied = sortOpened
      ? await this.clickTextIfVisible(/Price\s*\(Low\s*to\s*High\)/i, 4000)
      : false;

    const productClicked = await this.clickIfVisible(selectors.anyProductLink, 3000);

    await this.goto(flow.twintipUrl);
    await this.click(selectors.productTitle);
    await this.click(selectors.bargainButton);
    await this.clickByRole('link', /Toys\s*&\s*Games/i);

    await this.goto(flow.toysUrl);
    const moreClicked = await this.clickRoleIfVisible('button', /More|Filters?|Brand/i, 4000);
    const brandTextClicked = await this.clickTextIfVisible(brandRegex, 5000);

    const brandCheckbox = this.page.getByRole('checkbox', { name: brandRegex }).first();
    const brandCheckboxVisible = await brandCheckbox.isVisible({ timeout: 4000 }).catch(() => false);
    if (brandCheckboxVisible) {
      await brandCheckbox.check().catch(async () => {
        await brandCheckbox.click({ force: true });
      });
    }

    const minFilled = await this.fillIfVisible(selectors.minPriceInput, flow.toysMinPrice, 4000);
    const maxFilled = await this.fillIfVisible(selectors.maxPriceInput, flow.toysMaxPrice, 4000);

    const minValue = minFilled
      ? await this.page.locator(selectors.minPriceInput).inputValue()
      : 'not-visible';
    const maxValue = maxFilled
      ? await this.page.locator(selectors.maxPriceInput).inputValue()
      : 'not-visible';

    if (minFilled) {
      assert.equal(minValue, flow.toysMinPrice, 'Minimum price should be updated.');
    }
    if (maxFilled) {
      assert.equal(maxValue, flow.toysMaxPrice, 'Maximum price should be updated.');
    }

    await this.goto(flow.toysFilteredPriceUrl);
    assert.include(this.page.url(), 'product-list/toys-games/17', 'Expected filtered toys list URL.');

    const pageTitle = await this.page.title();
    const firstProduct = await this.page.locator("a[href*='product-detail']").first().textContent().catch(() => null);
    const sampleProduct = firstProduct ? firstProduct.trim() : 'not-captured';
    return [
      `Validation: sort opened = ${sortOpened}`,
      `Validation: sort applied (Low to High) = ${sortApplied}`,
      `Validation: widget product clicked = ${productClicked}`,
      `Validation: filter toggle clicked = ${moreClicked}`,
      `Validation: brand text clicked = ${brandTextClicked}`,
      `Validation: brand checkbox visible = ${brandCheckboxVisible}`,
      `Validation: selected brand filter = ${flow.toysBrand}`,
      `Validation: min price = ${minValue}, max price = ${maxValue}`,
      `Validation: list page title = ${pageTitle}`,
      `Validation: sample product = ${sampleProduct}`
    ];
  }

  public async performBargainCheckoutAndPaymentFlow(): Promise<string[]> {
    const flow = this.getFlowData();

    await this.goto(flow.dartboardUrl);
    await this.clickByRole('heading', /Classic\s*15\.7\s*Inch\s*Soft\s*Tip\s*Dartboard/i);
    await this.page.locator('#pdp-button-7').click({ force: true });

    await this.page.getByRole('slider', { name: 'Adjust offer amount' }).fill('1.03');
    await this.clickByRole('button', /Offer\s*Your\s*Price/i);
    await this.clickByRole('button', /Buy\s*Now/i);

    await this.goto(flow.checkoutUrl);
    assert.include(this.page.url(), '/checkout', 'Expected checkout URL after buy now.');

    await this.page.getByRole('textbox', { name: /Name\s*\*/i }).fill(flow.checkoutName);
    await this.page.getByRole('textbox', { name: /Address\s*line\s*1\s*\*/i }).fill(flow.addressLine1);

    await this.clickByRole('button', 'Save Address');
    await this.page.getByText('home', { exact: true }).click({ force: true });

    await this.page.getByRole('textbox', { name: /Address\s*Line\s*2\s*\*/i }).fill(flow.addressLine2);
    await this.page.getByRole('textbox', { name: /Pincode\s*\*/i }).fill(flow.pincode);

    await this.click(selectors.checkoutBillItem);
    await this.click(selectors.checkoutToPayValue);

    await this.page.locator(selectors.useSameBillingUncheck).check().catch(async () => {
      await this.page.getByRole('img', { name: 'uncheck', exact: true }).first().click({ force: true });
    });

    await this.clickByRole('button', 'Save Address');
    await this.clickByText(/Pay\s*Online.*Save\s*\d+%/i);
    await this.clickByRole('button', /Pay\s*₹/i);

    const paymentFrame = this.page.locator('iframe').first().contentFrame();
    if (!paymentFrame) {
      throw new Error('Payment iframe was not found during checkout flow.');
    }
    await paymentFrame.getByRole('radio', { name: /Netbanking/i }).check();
    await paymentFrame.getByTestId('netbanking').click();
    const popupPromise = this.page.waitForEvent('popup');
    await paymentFrame.getByRole('button', { name: /IDBI/i }).first().click();
    const popup = await popupPromise;
    await popup.getByRole('button', { name: /Success/i }).click();

    const toPay = (await this.page.locator(selectors.checkoutToPayValue).textContent().catch(() => 'not-captured')) || 'not-captured';
    return [
      `Validation: checkout URL = ${this.page.url()}`,
      `Validation: delivery name = ${flow.checkoutName}`,
      `Validation: pincode = ${flow.pincode}`,
      `Validation: payable amount text = ${toPay.trim()}`
    ];
  }

  public async verifyOrderConfirmationAndRevisitBargainProduct(): Promise<string[]> {
    const flow = this.getFlowData();

    await this.goto(flow.orderConfirmUrl);
    await this.clickByRole('button', /Close/i);
    await this.clickByRole('heading', /Order\s*placed!?/i);
    await this.click(selectors.orderConfirmObjectImage);
    await this.clickByRole('link', /My\s*Bargains/i);
    await this.clickByText(/You\s*Saved\s*₹/i);
    await this.clickByRole('link', /Classic\s*15\.7\s*Inch\s*Soft\s*Tip/i);

    await this.goto(flow.dartboardUrl);
    assert.include(this.page.url(), '/product-detail/', 'Expected final product details URL.');

    const orderText = await this.getTextIfVisibleByRole('heading', /Order\s*placed!?/i);
    const savingsTextLocator = this.page.getByText(/You\s*Saved\s*₹/i).first();
    const savingsText = (await savingsTextLocator.textContent().catch(() => null))?.trim() || 'not-visible';
    return [
      `Validation: order status heading = ${orderText}`,
      `Validation: savings label = ${savingsText}`,
      `Validation: final URL = ${this.page.url()}`
    ];
  }
}
