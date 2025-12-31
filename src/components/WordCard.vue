<template>
    <div class="word-card" @click="flipCard">
      <div :class="{ flipped: isFlipped }">
        <div class="front">{{ word.word }}</div>
        <div class="back">{{ word.translation }}</div>
      </div>
      <div class="actions">
        <button @click.stop="markAsCorrect">Correct</button>
        <button @click.stop="markAsFailed">Failed</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ['word'],
    data() {
      return {
        isFlipped: false,
      };
    },
    methods: {
      flipCard() {
        this.isFlipped = !this.isFlipped;
      },
      markAsCorrect() {
        this.$emit('mark-correct', this.word.id);
      },
      markAsFailed() {
        this.$emit('mark-failed', this.word.id);
      },
    },
  };
  </script>
  
  <style scoped>
  .word-card {
    position: relative;
    cursor: pointer;
  }
  .flipped .front {
    display: none;
  }
  .flipped .back {
    display: block;
  }
  .front, .back {
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .back {
    display: none;
  }
  .actions {
    margin-top: 10px;
  }
  </style>
  