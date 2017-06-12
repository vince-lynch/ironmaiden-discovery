var
express              = require('express'),
router               = express.Router();

// Models
var Session = require('../models/Sessions');
// Controllers
var spotifyController = require('../controllers/spotify');



var getAccessToken =function(req, res, next) {
  //req. = function() {
    Session.findOne({ sessionId: req.sessionID }, function(err, session) {
      if(session){
        console.log('mongoose - found session', session);
        req.accessToken = session.spotify_access_token;
        next();
      } else {
        console.log('mongoose - couldnt find session');
        next();
      }
    })
  //};
};







router.get('/api/test', function(req,res){
  res.json({test: 'Hello Vuejs'});
})


router.get('/auth/spotify',spotifyController.spotifyAuth);

router.get('/auth/check', function(req, res){
  console.log("req.headers:",req.headers);
})

router.post('/api/searchSpotify',getAccessToken, spotifyController.searchSpotify);
router.post('/api/getAlbums'    ,getAccessToken, spotifyController.getAlbums);
router.post('/api/getTracks'    ,getAccessToken, spotifyController.getTracks)




module.exports = router;