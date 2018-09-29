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
    button(v-on:click="submit()") Submit
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormField from './../components/FormField.vue';
import { Description } from 'joi';
import { getCard, getStripe } from './../lib/stripe';

@Component({
  components: { FormField },
})
export default class Checkout extends Vue {
  public forms = {
    schedule: this.$store.getters.formDescription('schedule'),
    payment: this.$store.getters.formDescription('payment'),
  };

  public submit() {
    // validate schedule form
    this.$store.dispatch('validateForm', 'schedule')
      .then(() => this.generateCardToken())
      .then(({error, token}) =>  this.commitCardToken(token, error))
      // validate the payment form
      .then(() => this.$store.dispatch('validateForm', 'payment'))
      // @todo final validation
      // .then(() => this.$store.dispatch('validateAllForms'))
      // @todo post data
      // .then(() => this.$store.dispatch('postAllForms'))
      // .then(() => this.afterCheckout())
      .catch(console.error.bind(null, 'SUBMIT ERROR')); //tslint:disable-line
  }

  private generateCardToken(): Promise<{error: any, token: string|null}> {
    const stripe = getStripe();
    const hasCard: boolean = this.$store.getters.formFieldState('payment', 'stripeCard').valid;
    const cardElement = getCard();

    if (hasCard && cardElement) {
      return stripe.createToken(cardElement);
    }

    return Promise.resolve({
      token: null,
      error: 'invalid/missing card',
    });
  }

  private commitCardToken(token: string|null, error: any) {
    if (token && !error) {
      this.$store.commit('formInput', {
        form: 'payment',
        field: 'stripeToken',
        value: btoa(JSON.stringify(token)),
      });

      return Promise.resolve();
    } else {
      return Promise.reject({
        error: error,
        module: 'checkoutToken',
      });
    }
  }
}
</script>
