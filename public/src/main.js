// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
import Vue from 'vue';


var VueAuthenticate = require('vue-authenticate');
import VueResource from 'vue-resource'


Vue.use(VueResource)

Vue.use(VueAuthenticate, {
  baseUrl: 'http://localhost:3080', // Your API domain 
  
  providers: {
    oauth2 : {
      name: 'spotify',
      url: 'https://accounts.spotify.com/authorize',
      clientId: 'caec1db59c614765bb0a7009122d1c17',
      redirectUri: 'https://app6.vincelynch.com/auth/spotify',
      authorizationEndpoint: 'https://accounts.spotify.com/authorize?response_type=code&client_id=caec1db59c614765bb0a7009122d1c17&redirect_uri=https://app6.vincelynch.com/auth/spotify&scope=user-top-read&scope=user-top-read',
    }
  }
})


Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

import App from './App.vue'
import Search from './Search.vue'

new Vue({ // eslint-disable-line no-new
  el: '#app',
  render: (h) => h(Search)
})

