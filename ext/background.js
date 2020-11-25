// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Intercept_HTTP_requests
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeSendHeaders
function logURL(requestDetails) {
    console.log("Loading: " + requestDetails.url);
    if(requestDetails.url.startsWith("https://api.twitter.com/2/timeline/profile/")) {
        console.log(requestDetails.url);
        console.log(requestDetails);
    }
}
  
browser.webRequest.onBeforeSendHeaders.addListener(
    logURL,
    {urls: ["<all_urls>"]},
    ["requestHeaders"]
);