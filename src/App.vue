<template lang="pug">
  #app
    .navbar
      .navbar-brand
        router-link.navbar-item(to="/")
          img(src="./assets/logo.png")
          span Home
        a(role="button" class="navbar-burger" aria-label="menu" aria-expanded="false")
          span(aria-hidden="true")
          span(aria-hidden="true")
          span(aria-hidden="true")
      .navbar-menu
        .navbar-start
          .navbar-item: router-link(to="/about") About
          .navbar-item: router-link(to="/post") Post
    .main: router-view
</template>
<style lang="scss" scoped>
@import "bulma/sass/utilities/_all.sass";
@import 'bulma/sass/components/navbar.sass';
</style>
