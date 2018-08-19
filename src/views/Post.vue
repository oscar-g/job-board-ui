<template lang="pug">
  section.post.container.is-widescreen
    h1 Post your job in minutes!
    div.post__step(v-for="(schema, name) in forms")
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { jobFormSchema, userFormSchema, companyFormSchema } from '@oscar-g/job-board-schema';
import FormField from '../components/FormField.vue';

@Component({
  components: { FormField },
})
export default class Post extends Vue {
  public forms = {
    job: jobFormSchema.describe(),
    user: userFormSchema.describe(),
    comp: companyFormSchema.describe(),
  };
}
</script>

<style lang="sass" scoped>
@import 'bulma/sass/utilities/_all.sass';
@import 'bulma/sass/elements/container.sass';
.post
  &__step
    &:not(:last-child)
      margin-bottom: $size-4
</style>
