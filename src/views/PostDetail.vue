<template lang="pug">
  article.post-detail(v-if="post")
    header
      h1 {{ post.title }}
      p {{ post.company.name }}

    section.meta
      p
        b Location:&nbsp;
        span {{ post.location }} 
      p
        b Workload:&nbsp;
        span {{ post.fulltime ? 'Fulltime': 'Part-time' }}
      p
        b Job Type:&nbsp;
        span {{ post.contract ? 'Contractor': 'Employment' }}
      p(v-if="post.reloc")
        b Relocation Assistance:&nbsp;
        span {{ post.reloc ? 'Yes': 'No'}}
      p(v-if="post.visa")
        b Visa Sponsorship:&nbsp;
        span {{ post.visa ? 'Yes': 'No'}}

    section.content
      p {{post.description}}

    hr
    footer
      p
        b To Apply: 
        span {{post.instructions}}
    pre {{post}}
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  data() {
    return {
      fetching: false,
      post: null, //this.$store.getters.postById(this.id),
    };
  },
})
export default class Preview extends Vue {
  @Prop(Number) public id!: number;
  public post: any;
  public fetching: boolean;

  public mounted() {
    this.fetching = true;
    this.$store.dispatch('getPost', this.id)
      .then((post) => {
        this.fetching = false;
        this.post = post;
      });
  }
}
</script>

