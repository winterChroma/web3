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
  <div>
    <slot></slot>
    <button @click="$emit('plantSeed', { crop: 'corn', row, column })">Corn</button>
    <button @click="$emit('plantSeed', { crop: 'df', row, column })">Tomato</button>
    <button @click="$emit('plantSeed', { crop: 'kamote', row, column })">Eggplant</button>
  </div>

</template>

<style scoped>
</style>
