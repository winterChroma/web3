<script>
export default {
  props: {
    row: Number,
    column: Number
  },
  emits: ['plantSeed']
}
</script>

<template>
  <div class="btn-crop-container">
    <slot></slot>
    <button @click="$emit('plantSeed', { crop: 'corn', row, column })" class="btn-xs">Corn</button>
    <button @click="$emit('plantSeed', { crop: 'df', row, column })" class="btn-xs">Tomato</button>
    <button @click="$emit('plantSeed', { crop: 'kamote', row, column })" class="btn-xs">Eggplant</button>
  </div>

</template>

<style scoped>

</style>
