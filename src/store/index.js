import { createStore } from 'vuex'

export default createStore({
  state: {
    user: window.sessionStorage.getItem('user'),
    curUser: window.sessionStorage.getItem('curUser')
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getCurUser(state) {
      return state.curUser
    }
  },
  mutations: {
    loginUser(state,palyload) {
      state.user = JSON.stringify(palyload);
      window.sessionStorage.setItem('user', JSON.stringify(palyload));
    },
    curUser(state, palyload) {
      state.curUser = JSON.stringify(palyload);
      window.sessionStorage.setItem('curUser', JSON.stringify(palyload));
    
    }
  },
  actions: {
  },
  modules: {
  }
})
