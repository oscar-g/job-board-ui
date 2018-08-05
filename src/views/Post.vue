<template lang="pug">
  article.post
    h1 Post your job in minutes!
    form
      .form-group
        b position:
        |job title, tags, category, description
      .form-group
        b company:
        div name,statement,logo,url,email
        div more (bio, description)
      .form-group
        b upgrades
        div highlight/color, logo, sticky
    
    h2 Step 2: Preview
    h2 Step 3: Payment
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// interface Field {
//   name: string
//   label: string
//   type: 'text'|'select'|'checkbox'|'radio'|'textarea'
//   value: string|number|string[]|number[]
// };

@Component({
  components: {
  },
})
export default class Post extends Vue {}
</script>
