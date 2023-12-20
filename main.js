import Vue from 'vue'
import App from './App' // webpack.config.js 확장자 생략 설정

var vm = new Vue({
  el: '#app',
  render: h => h(App)
})

window.app =vm;
