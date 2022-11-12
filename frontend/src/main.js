import { createApp } from 'vue'
import App from './App.vue'
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io'

const socketio = new VueSocketIO({
  debug: true,
  connection: io('http://13.212.81.162:3000'),
});

createApp(App)
  .use(socketio)
  .mount('#app')
