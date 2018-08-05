<template lang="pug">
  article.home
    section.sign-up
      h1 sign up for job updates
      form: input
    section
      h1 Recent Jobs
      ul
        li job 1
        li job 2
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    // HelloWorld,
  },
})
export default class Home extends Vue {}
</script>
