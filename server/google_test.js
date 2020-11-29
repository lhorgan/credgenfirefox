const express = require("express");

class Web {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.server = require('http').createServer(this.app);
    this.port = 3040;
    this.loadTwitter = true;
  }

  loadFirefox() {
    const webdriver = require('selenium-webdriver'),
      By = webdriver.By,
      until = webdriver.until;
    const firefox = require('selenium-webdriver/firefox');
    const options = new firefox.Options();
    options.setBinary('/home/luke/Documents/firefox_dev/firefox/firefox'); 
    //options.setProfile("/home/luke/Documents/firefox_dev/devdev");
    //options.addArguments("-profile", "/home/luke/Documents/firefox_dev/devdev")
    this.driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();
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
      this.loadTwitter = true;
    });
  }

  async sleep(ms) {
    return new Promise((accept, reject) => {
      setTimeout(accept, ms);
    });
  }

  async requestLoop() {
    let lastRequestTime = 0;
    while(true) {
      if(this.loadTwitter && Date.now() - lastRequestTime >= 10000) {
        lastRequestTime = Date.now();
        this.loadTwitter = false;
        this.driver.manage().deleteAllCookies();
        console.log("LOADING TWITTER");
        this.driver.get("https://twitter.com/realDonaldTrump");
      }
      await this.sleep(1000);
    }
  }
}

let web = new Web();
web.loadFirefox();
web.listenHTTP();
web.requestLoop();