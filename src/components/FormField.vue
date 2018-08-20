<template lang="pug"> 
.field.is-horizontal
  .field-label(:class="fieldLabelClass")
    label.label(v-bind="labelAttributes") {{schema.label || fieldName}}
  .field-body
    .field(v-if="hasTag('wysiwyg')")
      .control.wysiwyg
        textarea.textarea(:name="fieldName", :id="controlId" v-model="model")
      form-field-help(:formName="formName", :fieldName="fieldName")
    .field(v-else-if="hasTag('textarea')")
      .control
        textarea.textarea(:name="fieldName", :id="controlId" v-model="model")
      form-field-help(:formName="formName", :fieldName="fieldName")
    .field.is-narrow(v-else-if="hasTag('radio')")
      .control
        label.radio(v-for="(label, key) in radioValues")
          input(type="radio", :name="fieldName", :value="key" v-model="model")
          |  {{ label }}
      form-field-help(:formName="formName", :fieldName="fieldName")
    .field.is-narrow(v-else-if="hasTag('cb') && isType('boolean')")
      .control
        label.checkbox
          input(type="checkbox", :name="fieldName", :value="true", :id="controlId" v-model="model")
      form-field-help(:formName="formName", :fieldName="fieldName")
    .field(v-else)
      .control.is-expanded
        input.input(:name="fieldName" type="text", :id="controlId" v-model="model")
      form-field-help(:formName="formName", :fieldName="fieldName")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {Description} from 'joi';
import FormFieldHelp from './FormFieldHelp.vue';

@Component({
  components: { FormFieldHelp },
})
export default class FormField extends Vue {
  @Prop() public schema: Description;
  @Prop() public fieldName: string;
  @Prop() public formName: string;

  /**
   * Classes for the field label.
   */
  get fieldLabelClass(): string[] {
    const c = new Array<string>();

    if (!this.hasTag('radio') && !this.hasTag('cb')) {
      c.push('is-normal');
    }

    return c;
  }

  /**
   * The id of the input control element
   */
  get controlId(): string {
    return `${this.formName}Form${this.fieldName[0].toUpperCase()}${this.fieldName.slice(1)}`;
  }
  /**
   * Attributes for the field <label> element
   */
  get labelAttributes(): {[k: string]: string} {
    const atts: {[k: string]: string} = {};

    // unless radio, add the "for attribute"
    atts.for = this.controlId;

    return atts;
  }

  /**
   * Map of label => value, for the radio field.
   *
   * Do not call unless hasTag('radio')
   */
  get radioValues(): {[k: string]: string} {
    if (this.schema.meta) {
      return this.schema.meta[0].label;
    }

    return {};
  }

  get model(): any {
    return this.$store.getters.formFieldData(this.formName, this.fieldName);
  }

  set model(value: any) {
    this.$store.commit('formInput', {
      value,
      form: this.formName,
      field: this.fieldName,
    });
    this.$store.dispatch('validateField', {
      form: this.formName,
      field: this.fieldName,
    });
    this.$store.commit('setDirty', {
      value,
      form: this.formName,
      field: this.fieldName,
    });
    this.$store.commit('setTouched', {
      value,
      form: this.formName,
      field: this.fieldName,
    });
  }

  /**
   * Determine if the component has the specified tag.
   */
  public hasTag(tag: string): boolean {
    if (this.schema.tags) {
      if (this.schema.tags.indexOf(tag) > -1) {
        return true;
      }
    }

    return false;
  }

  /**
   * Determine if the component has the specified type.
   */
  public isType(type: string): boolean {
    if (this.schema.type) {
      return this.schema.type === type;
    }

    return false;
  }
}
</script>
<style lang="sass">
@import 'bulma/sass/utilities/_all.sass'
@import 'bulma/sass/elements/form.sass'
.field-body
  flex-grow 4
</style>
