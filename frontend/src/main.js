import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client';
import Game from './components/Game.vue'
import HowToPlay from './components/HowToPlay.vue'
import About from './components/About.vue'
import LogInScreen from './components/LogInScreen.vue'
import VueRouter from 'vue-router';
import VueSocketIO from 'vue-socket.io'

const socketio = new VueSocketIO({
  debug: true,
  //connection: io('http://13.212.81.162:3000'),
  connection: io('http://localhost:3000'),
});
Vue.use(socketio);
Vue.use(VueRouter);

const routes = [
  { path: '/', component: LogInScreen },
  { path: '/play', component: Game },
  { path: '/how-to-play', component: HowToPlay },
  { path: '/about', component: About }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

new Vue({
  router: router,
  render: (h) => h(App)
}).$mount('#app')
