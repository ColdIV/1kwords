<template>
    <div>
      <select v-model="selectedLanguage" @change="updateWords">
        <option v-for="language in Object.keys(wordsData)" :key="language">{{ language }}</option>
      </select>
      <div v-for="(word, index) in wordsToShow" :key="index">
        <WordCard :word="word" @mark-correct="markAsCorrect" @mark-failed="markAsFailed" />
      </div>
    </div>
  </template>
  
  <script>
  import WordCard from './WordCard.vue';
  import { wordsData } from '../words/wordsData';
  
  export default {
    components: {
      WordCard,
    },
    data() {
      return {
        wordsData,
        selectedLanguage: 'French', // Default language
        progress: JSON.parse(localStorage.getItem('progress')) || {},
      };
    },
    computed: {
      wordsToShow() {
        const today = new Date().toISOString().slice(0, 10);
        if (!this.progress[today]) {
          this.progress[today] = this.getWordsForToday();
          this.saveProgress();
        }
        return this.progress[today];
      },
    },
    methods: {
      getWordsForToday() {
        const wordsForLanguage = this.wordsData[this.selectedLanguage];
        const shuffledWords = this.shuffle([...wordsForLanguage]);
        return shuffledWords.slice(0, 20);
      },
      shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      },
      markAsCorrect(word) {
        const todayWords = this.progress[new Date().toISOString().slice(0, 10)];
        const index = todayWords.findIndex(w => w.word === word.word && w.translation === word.translation);
        if (index !== -1) {
          todayWords[index].correct = true;
          this.saveProgress();
        }
      },
      markAsFailed(word) {
        const todayWords = this.progress[new Date().toISOString().slice(0, 10)];
        const index = todayWords.findIndex(w => w.word === word.word && w.translation === word.translation);
        if (index !== -1) {
          todayWords[index].failed = true;
          this.saveProgress();
        }
      },
      saveProgress() {
        localStorage.setItem('progress', JSON.stringify(this.progress));
      },
      updateWords() {
        const today = new Date().toISOString().slice(0, 10);
        this.progress[today] = this.getWordsForToday();
        this.saveProgress();
      },
    },
  };
  </script>
  