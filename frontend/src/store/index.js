import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'

const getDefaultState = () => {
  return {
    token: null,
    user: null,
    posts: null
  }
}

const store = createStore({
  plugins: [createPersistedState()],
  state: getDefaultState(),
  getters: {
    isLoggedIn: state => {
      return state.token;
    },
    getUser: state => {
      return state.user
    },
    getPosts: state => {
      return state.posts
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_POSTS: (state, posts) => {
      state.posts = posts
    },
    RESET: state => {
      Object.assign(state, getDefaultState());
    }
  },
  actions: {
    login: ({ commit }, { token, user }) => {
      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      
      // set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    logout: ({ commit }) => {
      commit('RESET', '')
    }
  },
  modules: {
  }
})

export default store
