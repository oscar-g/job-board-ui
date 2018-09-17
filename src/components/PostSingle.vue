<template lang="pug">
.post-single
  header
    h1 {{ title }}
    p {{ company.name }}
  hr
  section.meta
    p
      b Location:&nbsp;
      span {{ location }} 
    p
      b Workload:&nbsp;
      span {{ fulltime ? 'Fulltime': 'Part-time' }}
    p
      b Job Type:&nbsp;
      span {{ contract ? 'Contractor': 'Employment' }}
    p(v-if="reloc")
      b Relocation Assistance:&nbsp;
      span {{ reloc ? 'Yes': 'No'}}
    p(v-if="visa")
      b Visa Sponsorship:&nbsp;
      span {{ visa ? 'Yes': 'No'}}
  hr
  section.content(v-html="description")
  footer
    p
      b To Apply: 
      span {{instructions}}
  hr
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class PostSingle extends Vue {
  @Prop() public id: number;
  @Prop() public title: string;
  @Prop() public location: string;
  @Prop() public fulltime: boolean;
  @Prop() public contract: boolean;
  @Prop() public reloc: boolean;
  @Prop() public visa: boolean;
  @Prop() public description: string;
  @Prop() public instructions: string;
  @Prop() public active: boolean;
  @Prop() public created: string;
  @Prop() public company: {
    name: string,
  };
}
</script>
