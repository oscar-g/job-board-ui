<template lang="pug">
  .preview
    post-single(v-bind="post")
    .preview__actions
      button(v-on:click="prev()") Edit Posting
      button(v-on:click="next()") Schedule & Payment
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PostSingle from './../components/PostSingle.vue';

@Component({
  components: {
    PostSingle,
  },
})
export default class Preview extends Vue {
  // @todo: if forms are not valid, redirect to "create post"
  // public mounted() {}

  public prev() {
    this.$router.push({ name: 'post' });
  }

  public next() {
    this.$router.push({ name: 'checkout' });
  }

  get post() {
    return {
      ...this.$store.getters.formData('job'),
      company: this.$store.getters.formData('company'),
    };
  }
}
</script>