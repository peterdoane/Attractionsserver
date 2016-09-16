require('dotenv').config()
var Yelp = require('yelp');
var express = require('express');

var yelp = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});

var app = express();

// proxy to yelp to avoid implementing oauth1.0 in react-native app
app.get('/searchYelp', function(req, res) {
  console.log("incoming search request");
  yelp.search({ term: req.query.term, location: req.query.location })
    .then(function (data) {
      console.log("it was successful");
      data
        .businesses
        .filter(business => !!business.image_url)
        .forEach(business => {
          console.log(business);
          business.image_url = business.image_url.replace(/ms(\.[a-zA-Z]*)$/, 'o$1');
        });

      res.send(data.businesses);
    })
    .catch(function (err) {
      console.log("There ws en error", err);
      res.error({error: err});
    });
})

console.log("we are running");

app.listen(3333);
