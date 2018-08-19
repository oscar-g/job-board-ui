<template lang="pug">
  section.post-form
    h1 Post your job in minutes!
    div(v-for="(schema, name) in forms")
      form(:id="name + 'Form'")
        form-field(
          v-for="(field, key) in schema"
          :key="key"
          :schema="field"
          :fieldName="key"
          :prefix="name"
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
    job: jobFormSchema.describe().children,
    user: userFormSchema.describe().children,
    comp: companyFormSchema.describe().children,
  };
}
</script>

<style lang="stylus" scoped>
.post-form
  max-width 768px
  padding 1em
</style>

