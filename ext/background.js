// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Intercept_HTTP_requests

//const { request } = require("http");

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeSendHeaders

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/proxy/onRequest
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/proxy/ProxyInfo

function logURL(requestDetails) {
  //console.log("Loading: " + requestDetails.url);
  if(requestDetails.url.startsWith("https://api.twitter.com/2/timeline/profile/")) {
    console.log(requestDetails.url);
    console.log(requestDetails);
    postData("http://localhost:3040/credentials", requestDetails.requestHeaders);
  }
}

// lifted from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest
 */
browser.webRequest.onBeforeSendHeaders.addListener(
    logURL,
    {urls: ["<all_urls>"]},
    ["requestHeaders"]
);

// match pattern for the URLs to redirect
var pattern1 = "https://pbs.twimg.com/*";
var pattern2 = "https://video.twimg.com/*";
//var pattern3 = "https://abs.twimg.com/*";

// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
  console.log("Canceling: " + requestDetails.url);
  return {cancel: true};
}

// add the listener,
// passing the filter argument and "blocking"
browser.webRequest.onBeforeRequest.addListener(
  cancel,
  {urls: [pattern1, pattern2]},
  ["blocking"]
);

async function cacheCheck(requestDetails) {
  console.log(requestDetails.url);
  //if(caches.match(requestDetails)) {
    console.log(`WE HAVE THIS IN THE CACHE YO: ${requestDetails.url}!`);
    caches.open(requestDetails.url).then(function(cache) {
      console.log("HERE IS THE CACHE INFO");
      console.log(cache);
    });
  //}
}

browser.webRequest.onBeforeRequest.addListener(
  cacheCheck,
  {urls: ["<all_urls>"]}
);