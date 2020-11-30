const express = require("express");
const { exec } = require("child_process");

class Web {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.server = require('http').createServer(this.app);
    this.port = 3040;
    this.loadTwitter = false;
    this.twitHits = 0;
    this.torRunning = false;
  }

  loadFirefox() {
    const webdriver = require('selenium-webdriver'),
      By = webdriver.By,
      until = webdriver.until;
    const firefox = require('selenium-webdriver/firefox');
    const options = new firefox.Options();
    options.setBinary('/home/luke/Documents/firefox_dev/firefox/firefox'); 
    options.setProfile("/home/luke/Documents/firefox_dev/devdev");
    //options.addArguments("-profile", "/home/luke/Documents/firefox_dev/devdev")
    this.driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();
  }

  async startTor() {
    console.log("STARTING TOR!");
    return new Promise((accept, reject) => {
      this.tor = exec("tor");
      this.tor.stdout.on('data', function(data) {
        console.log('tor: ' + data.toString());
        data.toString();

        if(data.toString().indexOf("Bootstrapped 100%") >= 0) {
          this.torRunning = true;
          accept(this.tor);
        }
        else if(data.toString().indexOf("exiting cleanly") >= 0) {
          console.log("SETTING TOR RUNNING FALSE");
          this.torRunning = false;
        }
      });

      this.tor.stderr.on('data', function(data) {
        console.log('tor error: ' + data.toString());
        data.toString();
      });
    });
  }
  
  listenHTTP() {
    console.log("SERVER LISTENING ON " + this.port);
    // Listen on the port specified in console args
    this.server.listen(this.port, ()  => {});

    /**
     */
    this.app.post("/credentials", async (req, res) => {
      this.twitHits++;
      console.log(this.twitHits);
      console.log("Got some creds!");
      //console.log(req);
      if(this.twitHits % 2 === 0) {
        console.log(req.body);
        res.send({"status": 200});

        this.killTor();
        await this.sleep(5000);
        //await this.startTor();
        this.loadTwitter = true;
      }
    });
  }

  async killTor() {
    return new Promise((accept, reject) => {
      exec("killall tor");
      while(true) {
        if(this.torRunning == false) {
          console.log("HOORAY TOR IS DEAD!");
          accept();
          break;
        }
        this.sleep(200);
      }
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

(async () => {
  let web = new Web();
  //web.loadFirefox();
  web.listenHTTP();
  await web.startTor();
  await web.killTor();
  
  console.log("SLEEPING FOR FIVE SECONDS");
  await web.sleep(5000);
  console.log("AWAKE!");

  await web.startTor();
  await web.killTor();
  //console.log("TOR STARTED!");
  //web.requestLoop();
})();