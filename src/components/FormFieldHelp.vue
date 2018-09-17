<template lang="pug">
div
  .field-help(v-if="helpText")
    p.help.is-info {{ helpText }}
  .field-help(v-if='hasErrors && showErrors')
    p.help.is-danger(v-for="msg in errors") {{msg}}
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IFieldState } from '../store/form';
import { AnySchema } from 'joi';

@Component
export default class FormFieldHelp extends Vue {
  @Prop() public fieldName: string;
  @Prop() public formName: string;

  get errors(): {[k: string]: string} {
    return this.$store.getters.formFieldErrors(this.formName, this.fieldName);
  }
  get hasErrors(): boolean {
    return Object.keys(this.errors).length > 0;
  }

  get showErrors(): boolean {
    const state: IFieldState = this.$store.getters.formFieldState(this.formName, this.fieldName);

    return !state.valid && state.dirty && state.touched;
  }

  get helpText(): string|null {
    const field: AnySchema = this.$store.getters.formFieldSchema(this.formName, this.fieldName);

    return field.describe().description || null;
  }

}
</script>
