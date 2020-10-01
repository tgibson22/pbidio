<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <UrlShortener msg="Fancy Url Shortener"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import UrlShortener from './components/UrlShortener.vue';

export default Vue.extend({
  name: 'App',
  components: {
    UrlShortener
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
