import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

// set auth header
axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;

createApp(App).use(store).use(router).mount('#app')
