<template>
    <div>
      <select v-model="selectedLanguage" @change="changeLanguage">
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedLanguage: 'en',
      };
    },
    methods:
    {
      changeLanguage() {
        this.$i18n.locale = this.selectedLanguage;
        localStorage.setItem('language', this.selectedLanguage);
      },
    },
    mounted() {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        this.selectedLanguage = savedLanguage;
        this.$i18n.locale = savedLanguage;
      }
    },
  };
  </script>
  