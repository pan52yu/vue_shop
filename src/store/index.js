import Vue from 'vue'
import Vuex from 'vuex'
import { getLocal, setLocal } from '@/utils/storage'
import { USERKEYS } from '@/utils/local'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    user: getLocal(USERKEYS)
  },
  getters: {},
  mutations: {
    // 修改token 并存储token
    setUser (state, user) {
      state.user = user
      setLocal(USERKEYS, user)
    }
  },
  actions: {},
  modules: {}
})
