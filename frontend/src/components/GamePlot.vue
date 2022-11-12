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
    <h6>
      <slot></slot>
    </h6>
    <button @click="$emit('plantSeed', { crop: 'corn', row, column })">Corn</button>
    <button @click="$emit('plantSeed', { crop: 'df', row, column })">Dragon Fruit</button>
    <button @click="$emit('plantSeed', { crop: 'kamote', row, column })">Kamote</button>
  </div>

</template>

<style scoped>

</style>
