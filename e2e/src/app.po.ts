import { browser, by, element } from 'protractor';

/** Some class */
export class AppPage {
  /** Some method */
  public async navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl);
  }

  /** Some method */
  public async getTitleText(): Promise<string> {
    return element(by.css('app-root .content span')).getText();
  }
}
