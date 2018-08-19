import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import { Description } from 'joi';
import { initialFormState, FormName } from '@/store/form';

Vue.use(Vuex);


export default new Vuex.Store({
  strict: true,
  state: {
    posts: {
      fetching: true,
      data: [],
    },
    cats: [],
    form: initialFormState,
  },
  getters: {
    formDescription: ({form}) => (name: FormName): Description => {
      return form[name].schema.describe();
    },
    formData: ({ form }) => (name: FormName, field: string): any => {
      return (form[name].data)[field] || null;
    },
  },
  mutations: {
    fetchingPosts(state, payload: boolean) {
      state.posts.fetching = payload;
    },
    setPosts(state, payload) {
      state.posts.data = payload;
    },
    formInput(state, {value, form, field}) {
      Vue.set(state.form[form as FormName].data, field, value);
    },
  },
  actions: {
    fetchPosts({ commit }) {
      commit('fetchingPosts', true);

      return axios.get('jobs/latest').then((res) => {
        commit('setPosts', res.data.posts);
        commit('fetchingPosts', false);
        return res;
      // tslint:disable-next-line:no-console
      }).catch(console.log);
    },
  },
});
