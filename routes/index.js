var
express              = require('express'),
router               = express.Router();

// Models
var User = require('../models/User');

// Controllers
var spotifyController = require('../controllers/spotify');



router.use(function(req, res, next) {
  req.isAuthenticated = function() {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    User.findById(payload.sub, function(err, user) {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});

router.get('/api/test', function(req,res){
  res.json({test: 'Hello Vuejs'});
})


router.get('/auth/spotify',spotifyController.spotifyAuth);

router.get('/auth/check', function(req, res){
  console.log("req.headers:",req.headers);
})

router.post('/api/searchSpotify', spotifyController.searchSpotify);
router.post('/api/getAlbums'    , spotifyController.getAlbums);
router.post('/api/getTracks'    , spotifyController.getTracks)




module.exports = router;