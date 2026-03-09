<template>
  <div class="grade-buttons">
    <button class="btn-missed" @click="$emit('grade', false)">
      {{ $t('practice.missedIt') }}
    </button>
    <button class="btn-got-it" @click="$emit('grade', true)">
      {{ $t('practice.gotIt') }}
    </button>
  </div>
</template>

<script setup>
defineEmits(['grade'])
</script>
