import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: {
      fetching: true,
      data: [],
    },
    cats: [],
    userData: {},
  },
  mutations: {
    fetchingPosts(state, payload: boolean) {
      state.posts.fetching = payload;
    },
    setPosts(state, payload) {
      state.posts.data = payload;
    },
  },
  actions: {
    fetchPosts({ commit }) {
      commit('fetchingPosts', true);

      return axios.get('jobs/latest').then((res) => {
        commit('setPosts', res.data);
        commit('fetchingPosts', false);
        return res;
      });
    },
  },
});
