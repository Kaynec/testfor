import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import VueSocketIO from 'vue-3-socket.io';
import detectMobile from './mixins/detectMobile';
import SocketIO from 'socket.io-client';
import { useStudentStore } from '@/store';
import '../node_modules/skeleton-elements/scss/skeleton-elements.scss';
import '../node_modules/animate.css/animate.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { baseUrlDomain } from './api/apiclient';

(window as any).bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js');
const app = createApp(App);

app.component(
  'alert',
  require('@/modules/student-modules/alert/alert.vue').default
);

export const connection = SocketIO(baseUrlDomain, {
  query: { token: useStudentStore().getters.getStudentToken },
  transports: ['websocket']
});
connection.on('connect', () => {
  connection.emit('register', store.getters.getCurrentStudent);
});

app
  .use(
    new VueSocketIO({
      debug: true,
      connection: connection, //options object is Optional'http://localhost:3000',
      vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
      }
    })
  )
  .use(store)
  .use(router)
  .mixin(detectMobile);

app.mount('#app');

// Check that service workers are supported
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
