//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
//let Book = require('../app/models/book');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

// visit spotify developer to get a access_token to test with 
//https://developer.spotify.com/web-api/console/get-search-item/#complete

var spotify_api_access_token = 'BQBP_yyXw8AYRRW59GHFeUUwAPnQIUiQD0X7SXXY_isMCvDU91J_jv2kXIKDgcLWtn5XO2jnZNotXYkFIYL33zX8PfzlgcRbm_urNgzrXohXHKAgYjN5G8Aq4h6vid5c49u-qeAxVtqJKvB-_w-tMNIDFc7fBVYC3do';
var band_name = 'Iron Maiden';

chai.use(chaiHttp); 
//Our parent block //Before each test we empty the database
describe('Testing Backend API', () => {
    // beforeEach((done) => { 
    //     Book.remove({}, (err) => { 
    //        done();         
    //     });     
    // });

/*
  * Test the /GET route
  */
  describe('/test - check server up', () => {
      it('it should return a response', (done) => {
        chai.request(server)
            .get('/api/test')
            .end((err, res) => {
                //console.log('res', res);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('test');
                res.body.should.have.property('test').eql('Hello Vuejs');
              done();
            });
      });
  });

  //var access_token = 
  var album_id = '';

  describe('/getAlbums', () => {
      it('spotify array of albums', (done) => {
        chai.request(server)
            .post('/api/getAlbums')
            .send({
              access_token: spotify_api_access_token,
              album: {name: band_name}
            })
            .end((err, res) => {
                
                res.should.have.status(200);
                
                album_id = res.body.albums.items[0].id;

                res.body.albums.href.should.be.a('string').that.includes(band_name.split(" ")[0]);
                res.body.albums.items.should.be.a('array');
              done();
            });
      });
  });

  describe('/getTracks', () => {
      it('get tracks for Specific Album Id:' + album_id, (done) => {
     
        chai.request(server)
            .post('/api/getTracks')
            .send({
              access_token: spotify_api_access_token,
              albumId: album_id //'7hE5LtYUgQ9qzBD8ECuXlI'/
            })
            .end((err, res) => {
                //console.log('res.body', res.body);
                res.should.have.status(200);
                res.body.items.should.be.a('array');
              done();
            });
      });
  });


});