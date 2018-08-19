<template lang="pug"> 
.field.is-horizontal
  .field-label(:class="fieldLabelClass")
    label.label(v-bind="labelAttributes") {{schema.label || fieldName}}
  .field-body
    .field(v-if="hasTag('wysiwyg')")
      .control.wysiwyg
        textarea.textarea(:name="fieldName", :id="controlId")
    .field(v-else-if="hasTag('textarea')")
      .control
        textarea.textarea(:name="fieldName", :id="controlId")
    .field.is-narrow(v-else-if="hasTag('radio')")
      .control
        label.radio(v-for="(label, key) in radioValues")
          input(type="radio", :name="fieldName", :value="key")
          |  {{ label }}
    .field.is-narrow(v-else-if="hasTag('cb') && isType('boolean')")
      .control
        label.checkbox
          input(type="checkbox", :name="fieldName", :value="true", :id="controlId")
    .field(v-else)
      .control.is-expanded
        input.input(:name="fieldName" type="text", :id="controlId")
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {Description} from 'joi';

@Component
export default class FormField extends Vue {
  @Prop() public schema: Description;
  @Prop() public fieldName: string;
  @Prop() public prefix: string;

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
    return `${this.prefix}Form${this.fieldName[0].toUpperCase()}${this.fieldName.slice(1)}`;
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
</style>
