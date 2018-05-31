// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './components/vuex/store'
import  VueResource  from 'vue-resource'
import ElementUI from 'element-ui'
import echarts from 'echarts';
import moment from 'moment';
import $ from 'jquery';
import 'element-ui/lib/theme-default/index.css'
import '../static/common/css/common.css'
import '../static/common/css/reset.css'
import '../static/css/home.scss'
import '../static/css/node.scss'

import '../node_modules/element-ui/lib/theme-default/index.css';

Vue.use(ElementUI)
Vue.use(VueResource)
// Vue.prototype.GLOBAL = global

// new Vue({
//   el: '#app',
//   router,
//   store,
//   template: '<App/>',
//   components: { App }
// });

var vm = new Vue({
  router,
  store,
  ...App
}).$mount("#app");
