// // // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Intercept_HTTP_requests

// const { request } = require("express");
// const { url } = require("inspector");

// // const { request } = require("express");

// // //const { request } = require("http");

// // // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeSendHeaders

// // // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/proxy/onRequest
// // // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/proxy/ProxyInfo

PORT = 15791;

function logURL(requestDetails) {
  console.log("Loading: " + requestDetails.url);
  if(requestDetails.url.startsWith("https://api.twitter.com/2/timeline/profile/")) {
    console.log(requestDetails.requestHeaders);
    console.log(requestDetails);
    console.log("THE HEADERS: ");
    postData("http://localhost:3040/credentials", requestDetails.requestHeaders);
  }
}

// // lifted from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// async function postData(url = '', data = {}) {
//   // Default options are marked with *
//   //console.log("SENDING THE FOLLOWING DATA");
//   // data = {"hello": "world"};
//   // console.log(data);

//   const response = await fetch(url, {
//     credentials: 'include',
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     mode: 'no-cors', // no-cors, *cors, same-origin
//     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
//     //credentials: 'same-origin', // include, *same-origin, omit
//     headers: {
//       'Content-Type': 'application/json'
//       // 'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     redirect: 'follow', // manual, *follow, error
//     referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//     body: JSON.stringify(data) // body data type must match "Content-Type" header
//   });
//   //console.log(response);
//   return response.json(); // parses JSON response into native JavaScript objects
// }


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

// /**
//  * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onBeforeRequest
//  */
browser.webRequest.onBeforeSendHeaders.addListener(
    logURL,
    {urls: ["<all_urls>"]},
    ["requestHeaders"]
);

// // // match pattern for the URLs to redirect
var pattern1 = "https://pbs.twimg.com/*";
var pattern2 = "https://video.twimg.com/*";
//var pattern3 = "https://abs.twimg.com/*";

// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
  //console.log("Canceling: " + requestDetails.url);
  return {cancel: true};
}

// add the listener,
// passing the filter argument and "blocking"
browser.webRequest.onBeforeRequest.addListener(
  cancel,
  {urls: [pattern1, pattern2]},
  ["blocking"]
);

// function setProxyPort(requestDetails) {
//   //console.log("SET PROXY PORT CALLED!");
//   let url = requestDetails.url;
//   let param = "lazerproxyport";
//   let proxyPortIndex = url.indexOf(param);
//   if(proxyPortIndex >= 0) {
//     //console.log(`${url} qualifies, maybe!!`);
//     let port = url.substr(proxyPortIndex + param.length);
//     if(port[port.length - 1] === "/") {
//       port = port.substr(0, port.length - 1);
//     }
//     let newURL = url.substr(0, proxyPortIndex - 1);
//     //console.log("URL TO REDIRECT TO: " + newURL);
//     return {redirectURL: "https://google.com"};
//   }
//   return {};
// }

// browser.webRequest.onBeforeRequest.addListener(
//   setProxyPort,
//   {urls: ["<all_urls>"], types: ['main_frame', 'sub_frame']},
//   ["blocking"]
// );

// // // async function cacheCheck(requestDetails) {
// // //   //console.log(requestDetails.url);
// // //   //if(caches.match(requestDetails)) {
// // //     //console.log(`WE HAVE THIS IN THE CACHE YO: ${requestDetails.url}!`);
// // //     caches.open(requestDetails.url).then(function(cache) {
// // //       //console.log("HERE IS THE CACHE INFO");
// // //       //console.log(cache);
// // //     });
// // //   //}
// // // }

// // // browser.webRequest.onBeforeRequest.addListener(
// // //   cacheCheck,
// // //   {urls: ["<all_urls>"]}
// // // );

browser.proxy.onRequest.addListener(
  doProxy,             //  function
  {urls: ["<all_urls>"]},               //  object
  ["requestHeaders"]
)

function doProxy(requestDetails) {
  //console.log("TIME TO PROXY: " + PORT + " " + requestDetails.url);
  //console.log(requestDetails);

  if(requestDetails.url.startsWith("http://localhost") || requestDetails.url.startsWith("http://127.0.0.1")) {
    console.log("NOT PROXYING " + requestDetails.url);
    return {type: "direct"}
  }

  //return {type: "direct"};
  return {
    type: "http",
    host: "gate.smartproxy.com",
    port: PORT,
    //proxyAuthorizationHeader: `Basic ${btoa("sostuff:life*1195")}`
  }
}

// function shouldProxyRequest(requestInfo) {
//   //console.log("Why hello there");
//   return requestInfo.parentFrameId != -1;
// }

// function handleProxyRequest(requestInfo) {
//   //if (shouldProxyRequest(requestInfo)) {
//     //console.log(`Proxying: ${requestInfo.url}`);
//   //  return {type: "http", host: "127.0.0.1", port: 65535};
//   //}
//   //return {type: "direct"};

//   let baseURL = "https://twitter.com/";
//   if(requestInfo.url.startsWith(baseURL)) {
//     let subURL = baseURL.substr(baseURL.length);
//     let urlParts = subURL.split("/");
//     if(urlParts.length === 1 || (urlParts.length === 2 && urlParts[1] === "")) {
//       //console.log(`${requestInfo.url} should start with a new proxy port!`);
//     }
//   }

//   return {"type": "direct"};
//   // return {
//   //   type: "http",
//   //   host: "gate.smartproxy.com",
//   //   port: 37451,
//   //   //proxyAuthorizationHeader: `Basic ${btoa("sostuff:life*1195")}`
//   // }
// }

// browser.proxy.onRequest.addListener(handleProxyRequest, {urls: ["<all_urls>"]});

browser.webRequest.onAuthRequired.addListener(
  provideCredentialsSync,
  {urls: ["<all_urls>"]},
  ["blocking"]
);

const myCredentials = {
  username: "soystuff",
  password: "life*1195"
}

function provideCredentialsSync(requestDetails) {
  // If we have seen this request before, then
  // assume our credentials were bad, and give up.
  // if (pendingRequests.indexOf(requestDetails.requestId) != -1) {
  //   //console.log(`bad credentials for: ${requestDetails.requestId}`);
  //   return {cancel:true};
  // }
  //pendingRequests.push(requestDetails.requestId);
  //console.log(`providing credentials for: ${requestDetails.requestId}`);
  return {authCredentials: myCredentials};
}

// // match pattern for the URLs to redirect
// var pattern = "https://mdn.mozillademos.org/*";

// // redirect function
// // returns an object with a property `redirectURL`
// // set to the new URL
// function redirect(requestDetails) {
//   //console.log("Redirecting: " + requestDetails.url);
//   return {
//     redirectUrl: "https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif"
//   };
// }

// // add the listener,
// // passing the filter argument and "blocking"
// browser.webRequest.onBeforeRequest.addListener(
//   redirect,
//   {urls:[pattern], types:["main_frame"]},
//   ["blocking"]
// );

async function sleep(ms) {
  return new Promise((accept, reject) => {
    setTimeout(accept, ms);
  });
}

// async function proxyPortLoop() {
//   while(true) {

//     await sleep(50);
//   }
// }

// (async () => {
//   proxyPortLoop();
// })();

setInterval(async () => {
  let resp = await postData("http://127.0.0.1:3040/proxyPort", {});
  //console.log(resp);
  PORT = resp.port;
}, 2000);