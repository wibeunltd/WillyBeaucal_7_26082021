// Imports
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Toast from 'vue-toastification'
import moment from 'moment'
import VTooltipPlugin from 'v-tooltip'
import "v-tooltip/dist/v-tooltip.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "@/assets/css/main.css"
import "vue-toastification/dist/index.css"

// Instanciation de l'application
const app = createApp(App)

// Déclaration de l'entête d'authentification
axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;

// Configuration globale de moment
app.config.globalProperties.$moment = moment
moment.locale('fr')

app
.use(store)
.use(router)
.use(Toast, {
    transition: "Vue-Toastification__fade"
})
.use(VTooltipPlugin)
.mount('#app')