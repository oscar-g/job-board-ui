<template lang="pug">
.checkout
  .checkout__step(v-for="(schema, name) in forms")
    form(:id="name + 'Form'"): fieldset
      legend(v-if="schema.label") {{schema.label}}
      form-field(
        v-for="(field, key) in schema.children"
        :key="key"
        :schema="field"
        :fieldName="key"
        :formName="name"
      )
  .checkout__actions
    button Submit
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormField from './../components/FormField.vue';
import { Description } from 'joi';

@Component({
  components: { FormField },
})
export default class Checkout extends Vue {
  public forms = {
    schedule: this.$store.getters.formDescription('schedule'),
    payment: this.$store.getters.formDescription('payment'),
  }
}
</script>
