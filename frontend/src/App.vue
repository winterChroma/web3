<template>
  <div class="hero-image container">
    <Game />
    <WalletConnect/>
  </div>
</template>

<style scoped>
.hero-image{
  background-image: url('./assets/grasstile.png')
}
.container {
  display: block;
  margin-left: 200px;
  height: 800px;
  width: 1000px;
}
</style>

<script setup>
  import Game from './components/Game.vue'
  import WalletConnect from './components/WalletConnect.vue'
</script>