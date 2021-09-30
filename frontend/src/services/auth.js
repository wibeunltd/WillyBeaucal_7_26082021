import axios from 'axios'

export default {
    login(credentials) {
        return axios.post(process.env.API_URL + 'users/login', credentials)
        .then(response => response.data)
    },
    register(credentials) {
        return axios.post(process.env.API_URL + 'users/register', credentials)
        .then(response => response.data)
    },
    profile(credentials) {
        return axios.get(process.env.API_URL + 'users/profile', credentials)
        .then(response => response.data)
    }
}