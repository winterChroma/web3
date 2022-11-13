import Vue from 'vue'
import App from './App.vue'
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io'

const socketio = new VueSocketIO({
  debug: true,
  //connection: io('http://13.212.81.162:3000'),
  connection: io('http://localhost:3000'),
});
Vue.use(socketio)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
