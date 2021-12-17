import axios from 'axios'

const url = process.env.VUE_APP_API_URL

export default {
    login(credentials) {
        return axios.post(url + 'users/login', credentials)
        .then(response => response.data)
    },
    register(credentials) {
        return axios.post(url + 'users/register', credentials)
        .then(response => response.data)
    },
    profile() {
        return axios.get(url + 'users/profile')
        .then(response => response.data)
    },
    resendConfirmationMail(credentials) {
        return axios.post(url + 'users/activation/sendingMailFailed', credentials)
        .then(response => response.data)
    }
}