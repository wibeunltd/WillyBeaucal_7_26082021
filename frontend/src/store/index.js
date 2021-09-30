import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'

const getDefaultState = () => {
  return {
    token:'',
    user:{}
  }
}

export default createStore({
  plugins: [createPersistedState()],
  state: getDefaultState(),
  getters: {
    isLoggedIn: state => {
      return state.token;
    },
    getUser: state => {
      return state.user
    }
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    RESET: state => {
      Object.assign(state, getDefaultState());
    }
  },
  actions: {
    login: ({ commit, /*dispatch*/ }, { token, user }) => {
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
