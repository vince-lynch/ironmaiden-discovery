
<template>
  <div id="intro">
	<h1>Music App</h1>
	<!-- access_token: {{access_token}} -->
	<input type="text" class="form-control" v-model="searchText" placeholder="Search for..." />
	<button v-on:click="doSearch(searchText)" class="btn btn-primary">Search</button>


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
		           <div>
            			<span>{{album.name}}</span>
           			</div>

				</li>
			</ul>
		</div>
	</div>


	<div id="showModal" v-if="showModal == true" >
		  <div id="white-Card">
		   <img src="/images/Cross@2x.png" width="50px" height="50px"  style="position: absolute;right: 0px;z-index: 4" v-on:click="closeModal()">
		    <div style="background: #383a49;"><div  class="show-image" :style="{'background': 'url(' + selectedAlbum.images[0].url +')'}">
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
		         <span style="font-size: 22px; color: black; font-weight: 600;">{{track.name}}</span><br/>
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
		  foundTracks: this.foundTracks
		}
	},
	mounted() {
	  this.musicList = [];
	  this.musicListLoaded = false;
	  this.selectedAlbum   = [];
	  this.showModal 	   = false;
	  this.foundTracks     = [];
	  // When the application loads, we want to call the method that initializes
	  // some data
	  //return 
	  console.log("[home -> vue.ready()]")
	  this.fetchEvents();
	  this.testReq();

	  this.redirectLogin();
	},
	methods: {
		redirectLogin: function(){
			console.log('redirectLogin called()', window.location.href);
			if(window.location.href == "https://app6.vincelynch.com/"){
				 window.location= "https://accounts.spotify.com/authorize?response_type=code&client_id=caec1db59c614765bb0a7009122d1c17&redirect_uri=https://app6.vincelynch.com/auth/spotify&scope=user-top-read&scope=user-top-read";
			} else {
				this.access_token = window.location.href.split('access_token=')[1];
				this.$http.headers.common.Authorization = 'Bearer' + this.access_token;

				this.$http.interceptors.push(function(request, next){
					request.method = 'POST';

					request.headers.set('authorization', 'Bearer ' + this.access_token);
				})
			}

		},

		fetchEvents: function(){
			console.log('fetchEvents called');
		},
		doSearch: function(searchText){
			console.log('doSearch reached, searchText:', searchText);
		   //$scope.searchSpotify('album', searchText);
           //$scope.searchSpotify('artist', searchText);
           var albumORartist = 'album';


		  this.$http.post('/api/searchSpotify',{albumORartist: albumORartist, query: searchText, offset: 0, limit: 20, access_token: this.access_token}).then(response => {
		    // get body data
		    //console.log('response', response.body)
		    //this.someData = response.body;
		    this.musicList = response.body[albumORartist + "s"].items;
		    console.log('this.musicList', this.musicList);
		    this.musicListLoaded = true;

		  }, response => {
		    // error callback
		    console.log('response')
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

		closeModal: function(){
			console.log("close modal called")
			this.showModal = false;
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
