
<template>
  <div id="intro">


	  <div class="col-md-2 col-lg-2 col-sm-2 col-xs-2">
		  <div class="iphone-wrapper">
		    <!-- Search Bar --> 
		      <div class="search-bar">
		         <nav class="tab-bar">
		      <section class="left-small">
		        <a class="left-off-canvas-toggle menu-icon" href="#"><span></span></a>
		           </section>
		        </nav>
		    </div>
		  <div class="search-canvas">
		   <ul class="side-left-menu">
		     <li class="active-item">
		     <ul>
		        <li class="voice-search">
		          <input class="radius" type="text" class='form-control' placeholder="Type an Artist, Song, Lyrics"  id="searchinput" type="text"  v-model="searchText">
		          <i class="fa fa-search"></i><a id="searchSubmit" v-on:click="doSearch(searchText)">Search</a>
		       </li>
		     </ul>
		     <li><i class="fa fa-spotify"></i>Browse</li>
		     <li><i class="fa fa-spotify"></i>Running</li>
		     <li><i class="fa fa-spotify"></i>Activity</li>
		     <li><i class="fa fa-spotify"></i>Radio</li>
		     <li><i class="fa fa-spotify"></i>Your Music</li>
		     <li><i class="fa fa-spotify"></i>Settings</li>
		    </ul>
		  </div>
		  
		  <div class="content-canvas">
		    <ul class="search-results"> 
		      <li class="list-header">
		     
		      </li>
		      <ul>
		  </div>
		  
		  </div>
	</div>
	<div class="col-md-10 col-lg-10 col-sm-10 col-xs-10">

		<!-- access_token: {{access_token}} -->
		<!-- <input placeholder="Search for..." />
		 -->


	   <div id="results" style="">
	   		<div v-if="musicListLoaded == false">
		   		<div class="magnifying-glass" ></div>
		   		<div id="search-results-text">
	     			<span >Your results will appear here</span>
	     		</div>
	     	</div>
		    <div id="actualResults" v-if="musicListLoaded == true">
				<ul class="grid">
					<li v-for="album in musicList" class="album-card-block" v-on:click="openDetail(album)">
						 <div class="image-container">
						 	<img :src="album.images[0].url" class="main-image" /> 
			           
							<div class="view-more-detail" >

				               <img src="/images/Bitmap@2x.png"/><br/>
				                <em v-if="album.type == 'album'">View Tracks</em>
				                <em v-if="album.type == 'artist'">View Albums</em>
				             </div>

				             <em v-if="album.type == 'album'" class="artistOrAlbum"><img src="/images/album-icon@2x.png" width="50px" height="50px"/> </em>
				             <em v-if="album.type == 'artist'" class="artistOrAlbum"><img src="/images/artist-icon@2x.png" width="33px" height="30px" style="margin-top: 4px; margin-left: 4px;"/> </em>

			           </div><!-- -->
			           <div style="overflow-y: hidden; height: 37px;">
	            			<span>{{album.name}}</span>
	           			</div>

					</li>
				</ul>
			</div>
		</div>




		

	</div>
  	
	<div id="spotifyModal" v-if="spotifyModal == true" >
		<div id="white-Card">
		  	<h1 style="color: black;">Login with Spotify</h1>
			<a class="button button--social-login button--spotify" @click="authenticate('oauth2')"><i class="icon fa fa-spotify"></i>Login With Spotify</a>


		</div>
	</div>
	<div id="showModal" v-if="showModal == true" >
		  <div id="white-Card">
		   <img src="/images/Cross@2x.png" width="50px" height="50px"  style="position: absolute;right: 0px;z-index: 4" v-on:click="closeModal()">
		    <div style="background: #383a49;">

			    <div  class="show-image" :style="{'background': 'url(' + selectedAlbum.images[0].url +')'}">
			    </div>
			     <span class="show-header-text">{{selectedAlbum.name}}</span>
		    </div>

		   <div class="container" v-if="selectedAlbum.type == 'artist'">
		     <span style="font-size: 23px;color:  #383a49;">Albums</span>
		     <hr/>
		     <ul>
		       <li v-for="album in selectedAlbum.albums" style="list-style-type: none; padding-bottom: 19px;" >
		         <img :src="album.images[0].url" width="100px" height="100px"><span ng-bind="album.name" style="font-size: 22px; color: black; font-weight: 600; margin-left: 21px; margin-top: 14px; position: absolute;"></span>
		       </li>
		     </ul>
		   </div>

		   <div class="container"  v-if="selectedAlbum.type == 'album'">
		     <span style="font-size: 23px;color:  #383a49;">Tracks</span>
		     <hr/>
		     <ul>
		       <li v-for="track in foundTracks"  style="list-style-type: none; padding-bottom: 19px;" ><!-- ng-if="$index < 4" -->  

		         <i class="fa fa-play-circle-o" aria-hidden="true" style="font-size: 40px"  v-on:click="playAudio(track.preview_url)"></i> <span style="font-size: 22px; color: black; font-weight: 600;">{{track.name}}</span><br/>
		         <span style="font-size: 16px; color: grey;">{{((track.duration_ms / 1000) / 60).toFixed(2)}} minutes</span>
		       </li>
		     </ul>
		   </div>
		  </div>
	</div>
	

  </div>

</template>



<script>

export default {
	name: 'intro',
	data () {
		return {
		  msg: 'Welcome to Your Vue.js App',
		  access_token: this.access_token,
		  musicList: this.musicList,
		  musicListLoaded: this.musicListLoaded,
		  selectedAlbum: this.selectedAlbum,
		  showModal: this.showModal,
		  foundTracks: this.foundTracks,
		  spotifyModal: this.spotifyModal,
		  totalSteps: 6,
		  completedSteps: 3
		}
	},
	mounted() {
	  this.musicList = [];
	  this.musicListLoaded = false;
	  this.selectedAlbum   = [];
	  this.showModal 	   = false;
	  this.foundTracks     = [];
	  this.spotifyModal    = false;
	  this.audioObject     = '';
	  // When the application loads, we want to call the method that initializes
	  // some data
	  //return 
	  console.log("[home -> vue.ready()]")
	  this.fetchEvents();
	  //this.testReq();

	  this.redirectLogin();
	},
	methods: {
		redirectLogin: function(){
			console.log('redirectLogin called()', window.location.href);

			if(window.location.href == "https://app6.vincelynch.com/"|| window.location.href == 'http://localhost:9876/context.html'){
				// Open spotify modal 
				this.spotifyModal = true; // prompt user to login

				// In Testing Mode
				if(window.testing_access_token != undefined){ // use this access token in Karma Testing Modes
					console.log('use this access token in Karma Testing Modes: ', window.testing_access_token);
					this.access_token = window.testing_access_token;
					window.access_token = this.access_token;
				}
			} else {
				window.close();
				// console.log('reached else');
				// this.spotifyModal = false;

				// this.access_token = window.location.href.split('access_token=')[1];
				// window.access_token = this.access_token; // for karma-testing

				// console.log('saved access token', this.access_token);
				// this.$http.headers.common.Authorization = 'Bearer' + this.access_token;

				// this.$http.interceptors.push(function(request, next){
				// 	request.method = 'POST';

				// 	request.headers.set('authorization', 'Bearer ' + this.access_token);
				// })
			}

		},

		fetchEvents: function(){
			console.log('fetchEvents called');
		},
		doSearch: function(searchText){
			console.log('doSearch reached, searchText:', searchText);
           var albumORartist = 'album';


		  this.$http.post('https://app6.vincelynch.com/api/searchSpotify',{albumORartist: albumORartist, query: searchText, offset: 0, limit: 20, access_token: this.access_token}).then(response => {
		    // get body data
		    //console.log('response', response.body)
		    //this.someData = response.body;
		    this.musicList = response.body[albumORartist + "s"].items;
		    console.log('this.musicList', this.musicList);
		    this.musicListLoaded = true;

		  }, response => {
		    // error callback
		    console.log('error - response')
		  });
        },


		openDetail: function(album){
			console.log("called openDetail", album);
			this.showModal = true;

			console.log('albumId', album.id)

			this.selectedAlbum = album;
			 
			if(album.type == 'artist'){ // GET ALBUMS

				this.$http.post('/api/getAlbums',{album: album, albumId: album.id, access_token: this.access_token, test: "hey"})
				.then(response => {
		            console.log("/api/getAlbums response", response.body);
		            response = response.body;
		            album.albums = response.albums.items;
		            this.selectedAlbum = album;

		        }, response => {
			    	// error callback
			    	console.log('error callback response')
			  	});      
	     	

			} else { // GET TRACKS

				this.$http.post('/api/getTracks',{album: album,  albumId: album.id, access_token: this.access_token})
				.then(response => {
		            console.log("/api/getTracks response", response.body);
		            response = response.body;
		            album.tracks = response.items;
		            this.foundTracks  = response.items;
		            this.selectedAlbum = album;
		        }, response => {
			    	// error callback
			    	console.log('error callback response')
			  	}); 

			}

		},
		playAudio: function(previewUrl){
			console.log('reached playAudio, previewUrl:', previewUrl);
			if (this.audioObject) {
                this.audioObject.pause();
            }
			this.audioObject = new Audio(previewUrl);
            this.audioObject.play();

		},

		closeModal: function(){
			console.log("close modal called")
			this.showModal = false;
		},

		authenticate: function (provider) {
		  this.spotifyModal = false;
	      this.$auth.authenticate(provider).then(function () {
	        // Execute application logic after successful social authentication
	        this.spotifyModal = false;
	      })
	    },

        testReq: function(){
        	console.log('just a testReq');

        	 this.$http.get('/api/test').then(response => {
			    // get body data
			    console.log('response', response.body);
			    //
			  }, response => {
			    // error callback
			    console.log('response')
			  });
        }
	}
}
</script>
