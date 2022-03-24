import { createStore } from 'vuex'

export default createStore({
  state: {
    user: window.sessionStorage.getItem('user'),
    curUser: window.sessionStorage.getItem('curUser'),
    // curIndex: '',
  },
  getters: {
    getUser(state) {
      return JSON.parse(state.user);
    },
    getCurUser(state) {
      return state.curUser;
    },
    // gerCurIndex(state) {
    //   return state.curIndex;
    // },
  },
  mutations: {
    //登录者
    loginUser(state,palyload) {
      state.user = JSON.stringify(palyload);
      window.sessionStorage.setItem('user', JSON.stringify(palyload));
    },
    //点击的用户
    curUser(state, palyload) {
      state.curUser = JSON.stringify(palyload);
      window.sessionStorage.setItem('curUser', JSON.stringify(palyload));
    },
    //导航栏
    // curIndex(state,palyload) {
    //   state.curIndex = palyload;
    // },
  },
  actions: {
  },
  modules: {
  }
})
