var stateKey = 'spotify_auth_state';
var querystring = require('querystring');
var request     = require('request');

var client_id = "caec1db59c614765bb0a7009122d1c17";
var client_secret = "239ca3f34d574d2c99d9d1e2c60dff26";
var redirect_uri = "https://app6.vincelynch.com/auth/spotify";




exports.searchSpotify = function(req, res){

    console.log("req.body.access_token", req.body.access_token);
    var access_token  = req.body.access_token;//req.headers.authorization.split("Bearer ")[1];

    var albumORartist = req.body.albumORartist;
    var query         = req.body.query;
    var offset        = req.body.offset == undefined ? 0 : req.body.offset;
    var limit         = req.body.limit  == undefined ? 20: req.body.limit;

    var options = {
      url: 'https://api.spotify.com/v1/search?q=' + query + '&type=' + albumORartist +'&offset=' + offset + '&limit=' + limit,
      headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json' },
      json: true
    };

    // use the access token to access the Spotify Web API
    request.get(options, function(error, response, body) {
      //console.log(body);
      if(!error & response.statusCode == 200){
        var data = JSON.stringify(body);

        res.json(JSON.parse(data))
      }

    });

}


exports.getAlbums = function(req, res){
    console.log("reached getAlbums")
    var album = req.body.album;

    console.log("req.body.access_token", req.body.access_token);
    var access_token  = req.body.access_token;//req.headers.authorization.split("Bearer ")[1];

    var options = {
      url: 'https://api.spotify.com/v1/search?q=' + album.name + '&type=' + "album",
      headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json' },
      json: true
    };

    request.get(options,function(error, response, body) {
      if(!error & response.statusCode == 200){
        var data = JSON.stringify(body);
        //console.log('data', data);
        res.json(JSON.parse(data))
      }
    })           
}

exports.getTracks = function(req, res){
    var albumId = req.body.albumId;
    console.log("reached getTracks for AlbumId:", albumId)

    //console.log("req.body.access_token", req.body.access_token);
    var access_token  = req.body.access_token;//req.headers.authorization.split("Bearer ")[1];


    var options = {
      url: "https://api.spotify.com/v1/albums/" + albumId + "/tracks?offset=0",
      headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json' },
      json: true
    };

    request.get(options,function(error, response, body) {
      if(error){
        console.log(' error getting tracks', error)
      }
      if(!error & response.statusCode == 200){
       // console.log('body', body);
        var data = JSON.stringify(body);
        res.json(JSON.parse(data))
      }
    })           
}




exports.spotifyAuth = function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (true == false) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/search?' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
};
