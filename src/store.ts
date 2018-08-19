import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import { jobFormSchema, userFormSchema, companyFormSchema } from '@oscar-g/job-board-schema';
import { Description, ObjectSchema } from 'joi';

Vue.use(Vuex);

interface IFormData {[k: string]: any; }

interface IFormState {
  schema: ObjectSchema;
  data: IFormData;
}

interface IForms {
  job: IFormState;
  user: IFormState;
  company: IFormState;
}

type FormName = keyof IForms;

const initialFormState = {
  job: {
    schema: jobFormSchema,
    data:  {} as IFormData,
  },
  user: {
    schema: userFormSchema,
    data: {} as IFormData,
  },
  company: {
    schema: companyFormSchema,
    data: {} as IFormData,
  },
};

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
