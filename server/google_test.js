// about:config
// xpinstall.signatures.required : false

// const webdriver = require('selenium-webdriver'),
//     By = webdriver.By,
//     until = webdriver.until;

// // https://sqa.stackexchange.com/questions/34851/nodejs-selenium-webdriver-firefox-geckodriver-set-browser-binary-location-withou
// const firefox = require('selenium-webdriver/firefox');
// const options = new firefox.Options()
//     .setBinary('/home/luke/Documents/firefox2020/firefox/firefox'); 

// const driver = new webdriver.Builder()
//     .forBrowser('firefox')
//     .build();

// driver.get('https://twitter.com/realDonaldTrump/');
// /*
// driver.findElement(By.name('q')).sendKeys('webdriver');

// driver.sleep(1000).then(function() {
//   driver.findElement(By.name('q')).sendKeys(webdriver.Key.TAB);
// });

// driver.findElement(By.name('btnK')).click();*/

// driver.sleep(2000).then(function() {
//   driver.getTitle().then(function(title) {
//     console.log(title);
//     driver.quit();
//   });
// });
const express = require("express");

class Web {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.server = require('http').createServer(this.app);
    this.port = 3040;
  }
  
  listenHTTP() {
    // Listen on the port specified in console args
    this.server.listen(this.port, ()  => {});

    /**
     */
    this.app.post("/credentials", (req, res) => {
      //console.log(req);
      console.log(req.body);
      res.send({"status": 200});
    });
  }
}

let web = new Web();
web.listenHTTP();