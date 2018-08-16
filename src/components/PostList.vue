<template lang="pug">
ul
  li(v-for="post in posts")
    p
      b {{post.title}}
    p
      span {{post.company.name}}
      span(v-if="post.company.tagline")
        span &nbsp;-&nbsp;
        i {{post.company.tagline}}
    p {{post.location}}
    p {{post.description}}
    p: nav
      a(href="#") view
      span &nbsp;|&nbsp;
      a(href="#") add to favorites
      span &nbsp;|&nbsp;
      a(href="#") hide
    //- pre {{post}}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class PostList extends Vue {
  @Prop(Array) public posts!: any[];
}
</script>
