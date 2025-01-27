<template>
  <div id="app">
    <LanguageSelector />
    <router-view />
  </div>
</template>

<script>
import LanguageSelector from './components/LanguageSelector.vue';

export default {
  components: {
    LanguageSelector,
  },
};
</script>


<style scoped>

</style>
