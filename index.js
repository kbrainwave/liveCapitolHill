var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');
var config = require(__dirname + "/config.js");

if(config == undefined || config.apikey == undefined || config.apikey == ""){
  throw Error("MUST CREATE YOUR OWN CONFIG FILE, LOOK AT CONFIG.TMP FOR AN EXAMPLE");
}


var app = express();

//Configure template engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Set up static folder
app.use(express.static(__dirname + '/public'));

var legislator = 'A000014';
var method = 'votes/';
var field1 = 'voter_ids.';
var bill = 'hr384-111';
var field2 = 'bill_id.';

//"http://congress.api.sunlightfoundation.com/" + method +"?" + field1 + legislator +"__exists=true" + "&voted_at__gte=2013-07-02T4:00:00Z"


//Paste your values
var api_key = config.apikey;

app.get('/',function(req, res){
  //Fetch elements from Sunlight API
  superagent.get("http://congress.api.sunlightfoundation.com/" + 
    method +"?" + field1 + legislator +"__exists=true" + "&fields=breakdown.total")
    .set('X-APIKey', api_key)
    .set({  Accept: 'application/json' })
    .end(function(e, sunlightResponse){
      console.log(sunlightResponse.headers);
      if (e){
        console.log('e');
        next(e);
      } 
      //Render template with story object in response body
      console.log(sunlightResponse.body);
      return res.render('index', sunlightResponse.body);      
    })

})

app.listen(3001);