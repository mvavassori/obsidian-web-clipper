/* global browser */
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Redirect to the options page
    browser.runtime.openOptionsPage();
  }
  if (details.reason === "update") {
    browser.runtime.openOptionsPage();
  }
});
