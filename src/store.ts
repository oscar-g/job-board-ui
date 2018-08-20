import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import { Description, AnySchema, ObjectSchema } from 'joi';
import {
  initialFormState, FormName, IFormState, IFieldState,
  IValidationErrorDetails, getSchemaChildren, ISchemaChild,
} from '@/store/form';

Vue.use(Vuex);
// @todo use typescript https://github.com/vuejs/vuex/issues/564
export default new Vuex.Store({
  strict: true,
  state: {
    posts: {
      fetching: true,
      data: [],
    },
    cats: [],
    // @todo allow multiple instances of the same form
    form: initialFormState,
  },
  getters: {
    formSchema: ({form}) => (name: FormName): ObjectSchema => {
      return form[name].schema;
    },
    formChildren:  (_, getters) => (name: FormName): ISchemaChild[] => {
      return getSchemaChildren(getters.formSchema(name));
    },
    formFieldSchema: (_, getters) => (name: FormName, field: string): AnySchema => {
      const formChildren: ISchemaChild[] = getters.formChildren(name);

      const f = formChildren.filter((x) => x.key === field);

      return f[0].schema;
    },
    formDescription: ({form}) => (name: FormName): Description => {
      return form[name].schema.describe();
    },
    formData: ({form}) => (name: FormName): {[k: string]: any} => {
      const fields = form[name].fieldState;

      return Object.keys(fields).reduce((obj, fieldName) => {
        // only set keys that have data
        if (fields[fieldName].value !== null) {
          obj[fieldName] = fields[fieldName].value;
        }

        return obj;
      }, {} as {[k: string]: any});
    },
    formFieldState: ({ form }) => (name: FormName, field: string): IFieldState => {
      return form[name].fieldState[field];
    },
    formFieldData: (_, getters) => (name: FormName, field: string): any => {
      return (getters.formFieldState(name, field) as IFieldState).value;
    },
    formFieldErrors: (_, getters) => (name: FormName, field: string): {[k: string]: string} => {
      return (getters.formFieldState(name, field) as IFieldState).errors;
    },
  },
  mutations: {
    fetchingPosts(state, payload: boolean) {
      state.posts.fetching = payload;
    },
    setPosts(state, payload) {
      state.posts.data = payload;
    },
    formInput(state, {form, field, value}) {
      const f = state.form[form as FormName];

      Vue.set(f.fieldState[field], 'value', value);
    },
    setValid(state, {form, field}) {
      const f: IFormState = state.form[form as FormName];

      f.fieldState[field] = {
        ...f.fieldState[field],
        valid: true,
        errors: {},
      };
    },
    setInvalid(state, {form, field}) {
      const f: IFormState = state.form[form as FormName];

      f.fieldState[field] = {
        ...f.fieldState[field],
        valid: false,
      };
    },
    setError(state, {form, field, message, type}) {
      const f: IFormState = state.form[form as FormName];
      const ff: IFieldState = f.fieldState[field];

      if (!ff.errors[type]) {
        ff.errors = {
          ...ff.errors,
          [type]: message,
        };
      }
    },
    clearErrors(state, {form, field}) {
      const f: IFormState = state.form[form as FormName];

      f.fieldState[field] = {
        ...f.fieldState[field],
        errors: {},
      };
    },
    setDirty(state, {form, field}) {
      const f: IFormState = state.form[form as FormName];

      f.fieldState[field] = {
        ...f.fieldState[field],
        dirty: true,
      };
    },
    setTouched(state, {form, field}) {
      const f: IFormState = state.form[form as FormName];

      f.fieldState[field] = {
        ...f.fieldState[field],
        touched: true,
      };
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
    /**
     * Trigger validation for a form
     */
    validateForm({commit, getters}, form: FormName) {
      const schema: AnySchema = getters.formSchema(form);

      schema.validate(getters.formData(form), {
        abortEarly: false,
      }).then((val) => {
          const formChildren: ISchemaChild[] = getters.formChildren(form);

          formChildren.forEach(({key}) => {
            const payload = {
              form,
              field: key,
            };

            commit('setDirty', payload);
            commit('setTouched', payload);

            commit('clearErrors', payload);
            commit('setValid', payload);
          });
        })
        .catch(({ details }) => {
          (details as IValidationErrorDetails[]).forEach((err) => {
            const payload = {
              form,
              field: err.context.key,
            };
            commit('setDirty', payload);
            commit('setTouched', payload);

            commit('clearErrors', payload);
            commit('setError', {
              ...payload,
              type: err.type,
              message: err.message,
            });
            commit('setInvalid', payload);
          });
        });
    },
    /**
     * Trigger validation for a single form field
     */
    validateField({state, commit, getters}, payload: {form: FormName, field: string}) {
      const fieldValue = getters.formFieldData(payload.form, payload.field);
      const schema: AnySchema = getters.formFieldSchema(payload.form, payload.field);

      schema.validate(fieldValue)
        .then((val) => {
          commit('setValid', payload);
          commit('clearErrors', payload);
        })
        .catch((err) => {
          const details: IValidationErrorDetails = err.details[0];

          commit('clearErrors', payload);
          commit('setError', {
            ...payload,
            type: details.type,
            message: details.message,
          });
          commit('setInvalid', payload);
        });
    },
  },
});
