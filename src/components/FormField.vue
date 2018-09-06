<template lang="pug"> 
.field.is-horizontal
  .field-label(v-if="!hasTag('hidden')", :class="fieldLabelClass")
    label.label(v-bind="labelAttributes") {{schema.label || fieldName}}
  .field-body
    .field(v-if="hasTag('wysiwyg')")
      .control.wysiwyg
        textarea.textarea(:name="fieldName", :id="controlId" v-model="model" v-on:focus="onFocus" v-on:blur="onBlur")
      form-field-help(:formName="formName", :fieldName="fieldName")
    .field(v-else-if="hasTag('textarea')")
      .control
        textarea.textarea(:name="fieldName", :id="controlId" v-model="model" v-on:focus="onFocus" v-on:blur="onBlur")
      form-field-help(:formName="formName", :fieldName="fieldName")
    .field.is-narrow(v-else-if="hasTag('radio') && isType('boolean')")
      .control
        label.radio
          input(type="radio", :name="fieldName", :value="true" v-model="model" v-on:focus="onFocus" v-on:blur="onBlur")
          |  {{ radioBooleanLabels.true }}
        label.radio
          input(type="radio", :name="fieldName", :value="false" v-model="model" v-on:focus="onFocus" v-on:blur="onBlur")
          |  {{ radioBooleanLabels.false }}
      form-field-help(:formName="formName", :fieldName="fieldName")
    .field.is-narrow(v-else-if="hasTag('cb') && isType('boolean')")
      .control
        label.checkbox
          input(type="checkbox", :name="fieldName", :value="true", :id="controlId" v-model="model" v-on:focus="onFocus" v-on:blur="onBlur")
      form-field-help(:formName="formName", :fieldName="fieldName")
    .field.is-narrow(v-else-if="hasTag('hidden')")
      input(type="hidden", :name="fieldName", :id="controlId")
    .field(v-else)
      .control.is-expanded
        input.input(:name="fieldName" type="text", :id="controlId" v-model="model" v-on:focus="onFocus" v-on:blur="onBlur")
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
   * Labels for boolean type radio
   *
   * Do not call unless hasTag('radio') and boolean type
   */
  get radioBooleanLabels(): {
    true: string,
    false: string,
  } {
    return {
      true: this.getMeta('labelTrue'),
      false: this.getMeta('labelFalse'),
    };
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
      form: this.formName,
      field: this.fieldName,
    });
    this.$store.commit('setTouched', {
      form: this.formName,
      field: this.fieldName,
    });
  }

  public onFocus() {
    this.$store.commit('setFocus', {
      form: this.formName,
      field: this.fieldName,
    });
    this.$store.commit('setTouched', {
      form: this.formName,
      field: this.fieldName,
    });
  }

  public onBlur() {
    this.$store.commit('setBlur', {
      form: this.formName,
      field: this.fieldName,
    });
  }

  /**
   * Determine if the component has the specified tag.
   */
  public hasTag(tag: string): boolean {
    if (this.schema.tags && this.schema.tags.length) {
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

  public getMeta(name: string): any {
    let value = null;


    (this.schema.meta || []).forEach((x) => {
      if (x[name]) { value = x[name]; }
    });

    return value;
  }
}
</script>
<style lang="sass">
@import 'bulma/sass/utilities/_all.sass'
@import 'bulma/sass/elements/form.sass'
.field-body
  flex-grow 4
</style>
