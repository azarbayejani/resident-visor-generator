// server.js
// where your node app starts

// init project
import express from 'express';
import PrintfulClient from '../shared/printfulclient.js';
import https from 'https';
import fs from 'fs'
const gm = require('gm').subClass({imageMagick: true});
import cheerio from 'cheerio';
const request = require('request');
const assets = require('./assets');

const app = express();
const printfulClient = new PrintfulClient(process.env.PRINTFUL_API_KEY);

const VISOR_PRODUCT_ID = 265;
const BLACK_VISOR_VARIANT_ID = 8913;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.use("/assets", assets);

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(req, response, next) {
  response.sendFile('/app/views/index.html');
});

app.get('/generate-text-image', function(req, response, next) {
  const text = req.query.q;
  gm()
    .rawSize(4800,1600)
    .out('-background', 'transparent')
    .out('-fill', 'white')
    .out('-gravity', 'Center')
    .out('-font', 'Helvetica-Bold')
    .out(`label:${text}`)
    .stream('png', function (err, stdout, stderr) {
      if (err) return next(err);
      response.set('Content-Type', 'image/png');

      stdout.pipe(response); //pipe to response

      // the following line gave me an error compaining for already sent headers
      //stdout.on('end', function(){res.writeHead(200, { 'Content-Type': 'ima    ge/jpeg' });}); 

      stdout.on('error', next);
  });
});

const getMockupGenerationRequest = (url) => {
  return {
    "variant_ids": [BLACK_VISOR_VARIANT_ID],
    "format": "png",
    "product_options": {
      "thread_colors": ["#FFFFFF"],
      "embroidery_type": "flat"
    },
    "files": [
      {
        "placement": "embroidery_front",
        "image_url": url,
        "position": {
          "area_width": 1200,
          "area_height": 400,
          "width": 1200,
          "height": 400,
          "top": 0,
          "left": 0
        }
      }
    ]
  }
}

const getMockupById = (id, resp) => {
  printfulClient
    .get('mockup-generator/task', { task_key: id })
    .success(function(data) { resp.send("success!"); });
};

const requestMockup = (url, resp) => {
  printfulClient
    .post(`mockup-generator/create-task/${VISOR_PRODUCT_ID}`, getMockupGenerationRequest(url) )
    .success(function({ task_key }) {
      resp.send({ task_key });
    })
    .error(function (error, info) { 
      console.error(error, info);
      resp.send({ failure: true, info });
    });
};

app.get('/submit-visor-request', function(req, response, next) {
  const text = req.query.text;
  const url = `https://${process.env.PROJECT_DOMAIN}.glitch.me/generate-text-image?q=${encodeURIComponent(text)}`;
  requestMockup(url, response);
});

app.get('/get-task', function(req, response, next) {
  const task_key = req.query.task_key;
  printfulClient.get(`mockup-generator/task?task_key=${task_key}`)
    .success(function(printful_response) {
      console.log(printful_response);
      response.send(printful_response);
    }).error(function (error, info) { 
      console.error(error, info);
      response.send({ failure: true, info });
    });
});

app.get('/get-resident-visor-text', function(req, response, next) {
  const url = req.query.url;
  request(url, function(err, resp, html) {
    if(!err) {  
      const $ = cheerio.load(html);
      response.send({
        title: $('#sectionHead h1').first().text(),
        rating: $('.rating').length ? $('.rating').first().text() : null
      });
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
