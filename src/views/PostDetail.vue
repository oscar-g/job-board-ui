<template lang="pug">
  div
    p post detail {{id}}
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

