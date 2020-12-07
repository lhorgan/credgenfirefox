const express = require("express");
const { exec } = require("child_process");
const axios = require("axios");

const lineByLine = require('n-readlines');
const fs = require("fs");

class Web {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.server = require('http').createServer(this.app);
    this.port = 3040;
    this.loadTwitter = false;
    this.twitHits = 0;
    this.torRunning = false;
    this.timeOfLastRequest = 0;
    this.readstream = new lineByLine("/home/luke/Documents/lazer/achtung/id_handle_mapping.tsv");
    this.handles = [];
    this.proxyPort = this.randomInt(10000, 50000);
  }

  readHandles(filename) {
    let line = this.readstream.next();
    let ctr = 0;
    while((line = this.readstream.next()) && ctr++ < 30000) {
      //console.log(line.toString());
      let handle = line.toString().split("\t")[2];
      //console.log(handle);
      this.handles.push(handle);
    }
  }

  loadFirefox() {
    const webdriver = require('selenium-webdriver'),
      By = webdriver.By,
      until = webdriver.until;
    const firefox = require('selenium-webdriver/firefox');
    const options = new firefox.Options();
    options.setBinary("/home/luke/Documents/ff/firefox/firefox")
    //options.setBinary('/home/luke/Documents/firefox_dev/firefox/firefox'); 
    //options.setProfile("/home/luke/Documents/firefox_dev/devdev");
    //options.addArguments("-profile", "/home/luke/Documents/firefox_dev/devdev")
    this.driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();
  }
  
  listenHTTP() {
    console.log("SERVER LISTENING ON " + this.port);
    // Listen on the port specified in console args
    this.server.listen(this.port, ()  => {});

    /**
     */
    this.app.post("/credentials", async (req, res) => {
      //console.log(this.twitHits);
      console.log("Got some credentials!");1
      
      let prevRequestTime = this.timeOfLastRequest;
      this.timeOfLastRequest = Date.now();

      //if(Date.now() - prevRequestTime >= 1000) {
        //console.log(req.body);
        res.send({"status": 200});
      //}
      //else {
        //console.log("DUP REQUEST!");
      //}

      //axios.post("http://localhost:3050/credentials", req.body); // uncomment this!

      let creds = {};
      for(let i = 0; i < req.body.length; i++) {
        creds[req.body[i].name] = req.body[i].value;
      }
      if("authorization" in creds && "Cookie" in creds) {
        console.log(creds);
        axios.post("http://localhost:3050/credentials", creds); // uncomment this!
      }
    });

    this.app.post("/proxyPort", (req, res) => {
      //console.log("WELL THEN!");
      res.send({"status": 200, "port": this.proxyPort});
    });
  }

  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async sleep(ms) {
    return new Promise((accept, reject) => {
      setTimeout(accept, ms);
    });
  }

  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async requestLoop() {
    let lastRequestTime = 0;
    while(true) {
      lastRequestTime = Date.now();
      await this.driver.manage().deleteAllCookies();
      let cookies = await this.driver.manage().getCookies();
      //console.log("COOKIES:");
      //console.log(cookies);
      this.driver.get(`https://twitter.com/${this.randomChoice(this.handles)}`);
      //this.driver.get("http://checkip.dyndns.org/");
      await this.sleep(10000);
      cookies = await this.driver.manage().getCookies();
      //console.log("OUR COOKIES!");
      //console.log(cookies);
      this.proxyPort = this.randomInt(10000, 50000);
      await this.sleep(1000);
    }
  }
}

(async () => {
  let web = new Web();
  web.readHandles("/home/luke/Documents/achtung/id_handle_mapping.tsv");
  web.loadFirefox();
  web.listenHTTP();
  web.requestLoop();
})();