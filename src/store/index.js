import { createStore } from 'vuex'

export default createStore({
  state: {
    user: window.sessionStorage.getItem('user'),
    curUser: window.sessionStorage.getItem('curUser'),
    room: window.sessionStorage.getItem("room")
  },
  getters: {
    getUser(state) {
      return JSON.parse(state.user);
    },
    getCurUser(state) {
      return state.curUser;
    },
    getRoom() {
      return state.room;
    }

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
    //点击的房间
    room(state, palyload) {
      state.room = JSON.stringify(palyload);
      window.sessionStorage.setItem('room', JSON.stringify(palyload));
    },
    //背景更改
    changeBackground(state, palyload) {
      let u = JSON.parse(state.user)
      u.chatBackground = palyload;
      state.user = JSON.stringify(u);
      window.sessionStorage.setItem('user', JSON.stringify(u));
    },
    //会员
    changeMember(state, palyload) {
      let u = JSON.parse(state.user)
      u.member = palyload;
      state.user = JSON.stringify(u);
      window.sessionStorage.setItem('user', JSON.stringify(u));

    }
  },
  actions: {
  },
  modules: {
  }
})
