<template>
    <div>
      <h1>Home Page</h1>
      <p>{{ $t('welcome') }}</p>
      <WordList />
    </div>
  </template>
  
  <script>
  import WordList from '../components/WordList.vue';

  export default {
    name: 'Home',
    components: {
      WordList,
    },
  };
  </script>
  