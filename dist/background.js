/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/* global chrome */
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // Redirect to the options page
    chrome.runtime.openOptionsPage();
  }
});
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0FBLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDQyxXQUFXLENBQUNDLFdBQVcsQ0FBQyxVQUFVQyxPQUFPLEVBQUU7RUFDeEQsSUFBSUEsT0FBTyxDQUFDQyxNQUFNLEtBQUssU0FBUyxFQUFFO0lBQ2hDO0lBQ0FMLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDSyxlQUFlLENBQUMsQ0FBQztFQUNsQztBQUNGLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2JzaWRpYW4td2ViLWNsaXBwZXIvLi9zcmMvYmFja2dyb3VuZC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgY2hyb21lICovXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcihmdW5jdGlvbiAoZGV0YWlscykge1xuICBpZiAoZGV0YWlscy5yZWFzb24gPT09IFwiaW5zdGFsbFwiKSB7XG4gICAgLy8gUmVkaXJlY3QgdG8gdGhlIG9wdGlvbnMgcGFnZVxuICAgIGNocm9tZS5ydW50aW1lLm9wZW5PcHRpb25zUGFnZSgpO1xuICB9XG59KTtcbiJdLCJuYW1lcyI6WyJjaHJvbWUiLCJydW50aW1lIiwib25JbnN0YWxsZWQiLCJhZGRMaXN0ZW5lciIsImRldGFpbHMiLCJyZWFzb24iLCJvcGVuT3B0aW9uc1BhZ2UiXSwic291cmNlUm9vdCI6IiJ9