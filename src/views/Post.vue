<template lang="pug">
  section.create-post.container.is-widescreen
    h1 Post your job in minutes!
    div.create-post__step(v-for="(schema, name) in forms")
      form(:id="name + 'Form'")
        fieldset
          legend(v-if="schema.label") {{schema.label}}
          form-field(
            v-for="(field, key) in schema.children"
            :key="key"
            :schema="field"
            :fieldName="key"
            :formName="name"
          )
    div.create-post__submit
      button(v-on:click="validateAndSubmit()") Next: Preview
        
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormField from '../components/FormField.vue';
import { Description } from 'joi';

@Component({
  components: { FormField },
})
export default class Post extends Vue {
  /**
   * Forms rendered in this view.
   * Should be the description() of a Joi.Object()
   */
  public forms: {[k: string]: Description} = {
    job: this.$store.getters.formDescription('job'),
    company: this.$store.getters.formDescription('company'),
  };

  public validateAndSubmit() {
    const p = [
      this.$store.dispatch('validateForm', 'job'),
      this.$store.dispatch('validateForm', 'company'),
    ];

    Promise.all(p)
      .then(([job, company]) => {
        this.$router.push('/preview');
      })
  }
}
</script>

<style lang="sass" scoped>
@import 'bulma/sass/utilities/_all.sass';
@import 'bulma/sass/elements/container.sass';
.create-post
  &__step
    &:not(:last-child)
      margin-bottom: $size-4
  fieldset
    padding: 0 $size-4 $size-2;
</style>
