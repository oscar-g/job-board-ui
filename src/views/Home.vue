<template lang="pug">
  article.home
    section.sign-up
      h1 sign up for job updates
      form: input
    section
      h1 Recent Jobs
      p(v-if='fetching') Fetching posts...
      div(v-if='!fetching')
        post-list(v-bind:posts="posts")


</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PostList from '@/components/PostList.vue';

@Component({
  components: {
    PostList,
  },
  computed: {
    posts() {
      return this.$store.state.posts.data;
    },
    fetching() {
      return this.$store.state.posts.fetching;
    },
  },
})
export default class Home extends Vue {
  public loading: boolean = true;

  public mounted() {
    this.$store.dispatch('fetchPosts');
  }
}
</script>
