// Spotify access token
var access_token = 'BQBAvyD7unXJD-QQFFNo9wXf5-TZfmRiN3_kAhICpQlETe6MzlFKwyMDyxOsKZ9Ne6o20q2YzTLhta12-gRwGx7oHiXOtLMjbtXVgTQOHykwwNoeLChY_cHpeu_6l6claMZKkx3AjHi76u8-zDOg&refresh_token=AQCHVwFaXnD0G5Uv0dJ86d0vgjUUcXU3np3fsYuQsWCK69locisQ1BrHUlVC9w4fRcH-vlu71ykQO_lJ8e48DGzTvbJrMqwXR82QEJhbT6WpbA-ncipS4nl5nrX3OGVj7bY';
window.testing_access_token = access_token;


import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

import Search from '../../src/components/Search.vue'

const view = new Vue({
  el: document.createElement('div'),
  render: (h) => h(Search)
}).$mount()

window.history.replaceState(null, null, '#/search?access_token=' + access_token);


describe('Render Vue', () => {
  it('should render correct contents', () => {
    expect(view.$el.querySelector('button').textContent).toBe('Search')
    
    console.log("window.location.href", window.location.href);
  })
})



describe('Access Token', () => {
  it('should have Spotify Access_token', () => {
	console.log('window.access_token', window.access_token);
    expect(window.access_token).toBe(access_token)
  })
})

    

describe('type search query', () => {
  it('should contain Iron Maiden', () => {

	var bandName = "Iron Maiden";
	var inputBox = view.$el.querySelector("input")// = bandName;
	inputBox.value = bandName;
	console.log('input in inputbox', inputBox)
	inputBox.dispatchEvent(new Event("input"));
	expect(inputBox.value).toBe(bandName)
  })
})


describe('Submit Query', () => {
  it('should do API call when button clicked', () => {
  	const button = view.$el.querySelector('button').click();

  })
})

 



// describe('return Albums', () => {
//   it('inputs form, searches, returns albums', () => {

//   	element('input#searchinput').enter('Iron Maiden');
    

//     element('button#searchSubmit').query(function($el, done) {
//       $el.click();
//       done();
//     });

//   })
// })




// also see example testing a component with mocks at
// https://github.com/vuejs/vueify-example/blob/master/test/unit/a.spec.js#L22-L43
