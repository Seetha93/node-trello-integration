var express = require('express');
 
var http = require('http')
var OAuth = require('oauth').OAuth
var url = require('url')

/*
/     Express Server Setup
*/
var app = express();

app.use(express.static('public'));

var server = app.listen(3000, function () {
  console.log('Server up and running...🏃🏃🏻');
  console.log("Listening on port %s", server.address().port);
});


/*
/     OAuth Setup and Functions  
*/
const requestURL = "https://trello.com/1/OAuthGetRequestToken";
const accessURL = "https://trello.com/1/OAuthGetAccessToken";
const authorizeURL = "https://trello.com/1/OAuthAuthorizeToken";
const appName = "Trello OAuth Example";

// Be sure to include your key and secret in 🗝.env ↖️ over there.
// You can get your key and secret from Trello at: https://trello.com/app-key
const key = '618d51c1976ea7bc6faaa4ad0bfd5df2' //process.env.TRELLO_KEY;
const secret = '7677c292d7bcdd24d80f9a184f311d02646dd3f4fa4d11dd0d402975c3a22506' //process.env.TRELLO_OAUTH_SECRET;

// Trello redirects the user here after authentication
//const loginCallback = "https://localhost:3000/showToken";
const loginCallback = 'https://localhost:3000/showToken';

// You should {"token": "tokenSecret"} pairs in a real application
// Storage should be more permanent (redis would be a good choice)
const oauth_secrets = {};

const oauth = new OAuth(requestURL, accessURL, key, secret, "1.0A", loginCallback, "HMAC-SHA1")

const login = function(req, res) {
  oauth.getOAuthRequestToken(function(error, token, tokenSecret, results){
    // console.log(`in getOAuthRequestToken - token: ${token}, tokenSecret: ${tokenSecret}, resultes ${JSON.stringify(results)}, error: ${JSON.stringify(error)}`);
    oauth_secrets[token] = tokenSecret;
    console.log(tokenSecret);
    res.redirect(`${authorizeURL}?oauth_token=${token}&name=${appName}`);
  });
};

/*
/     Routes
*/
app.get("/", function (request, response) {
  console.log(`GET '/' 🤠 ${Date()}`);
  response.send("<h1>Oh, hello there!</h1><a href='./login'>Login with OAuth!</a>");
});

app.get("/login", function (request, response) {
  console.log(`GET '/login' 🤠 ${Date()}`);
  login(request, response);
});

app.get("/callback", function (request, response) {
  console.log(`GET '/callback' 🤠 ${Date()}`);
  callback(request, response);
});

app.get("/showToken", function(request, response) {
  console.log(`GET '/showToken' ${Date()}`);
  const query = url.parse(request.url, true).query;
  const token = query.oauth_token;
  const tokenSecret = oauth_secrets[token];
  const verifier = query.oauth_verifier;
  oauth.getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results){
    // In a real app, the accessToken and accessTokenSecret should be stored
    console.log(`in getOAuthAccessToken - accessToken: ${accessToken}, accessTokenSecret: ${accessTokenSecret}, error: ${error}`);
    oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", accessToken, accessTokenSecret, function(error, data, res){
      // Now we can respond with data to show that we have access to your Trello account via OAuth
      console.log(`in getProtectedResource - accessToken: ${accessToken}, accessTokenSecret: ${accessTokenSecret}`);
      parsedData = JSON.parse(data)
      user = {}
      user['name'] = parsedData['username']
      user['idBoards'] = parsedData['idBoards']
      response.send(JSON.stringify(user))
    });
  });
});

api.get('/getCards/:boardId', function(request, response){
  
})

