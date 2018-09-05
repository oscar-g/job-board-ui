<template lang="pug">
ul.post-list
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
      router-link(:to="{ name: 'postDetail', params: { id: post.id } }") view
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
