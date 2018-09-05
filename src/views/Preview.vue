<template lang="pug">
  .preview 
    post-single(v-bind="post")
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

  get post() {
    return {
      ...this.$store.getters.formData('job'),
      company: this.$store.getters.formData('company'),
    };
  }
}
</script>