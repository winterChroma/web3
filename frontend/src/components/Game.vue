<script>
import GamePlot from './GamePlot.vue'

export default {
  components: {
    GamePlot: () => import('./GamePlot.vue')
  },
  data() {
    return {
      crops: [['', '', ''], ['', '', ''], ['', '', '']],
      cash: 9,
      players: 0,
      cornPrice: 1,
      dfPrice: 1,
      kamotePrice: 1,
      inGame: false,
      previousCrops: {}
    }
  },
  sockets: {
    numberOfPlayers(msg) {
      this.players = msg
    },
    updatePrice(msg) {
      let prices = JSON.parse(msg)
      this.cornPrice = prices.cornPrice
      this.dfPrice = prices.dfPrice
      this.kamotePrice = prices.kamotePrice
    },
    calculateWinnings() {
      this.cash += this.previousCrops['corn'] * this.cornPrice + this.previousCrops['df'] * this.dfPrice + this.previousCrops['kamote'] * this.kamotePrice
      this.previousCrops = {}
    },
    endRoundClient() {
      let df = 0
      let kamote = 0
      let corn = 0
      for (let row of this.crops) {
        for (let crop of row) {
          switch (crop) {
            case 'corn':
              corn++
              break
            case 'df':
              df++
              break
            case 'kamote':
              kamote++
          }
        }
      }
      this.crops = [['', '', ''], ['', '', ''], ['', '', '']]
      this.$socket.emit('receiveCrops', JSON.stringify({
        kamote, corn, df
      }))
      this.previousCrops = { kamote, corn, df }
      this.inGame = false
    },
    startRoundClient() {
      this.inGame = true
    }
  },
  methods: {
    plantSeed(msg) {
      if (this.crops[msg.row][msg.column] == '') {
        switch (msg.crop) {
          case 'corn':
            if (this.cornPrice <= this.cash) {
              this.cash -= this.cornPrice
              this.crops[msg.row][msg.column] = msg.crop
            }
            break
          case 'df':
            if (this.dfPrice <= this.cash) {
              this.cash -= this.dfPrice
              this.crops[msg.row][msg.column] = msg.crop
            }
            break
          case 'kamote':
            if (this.kamotePrice <= this.cash) {
              this.cash -= this.kamotePrice
              this.crops[msg.row][msg.column] = msg.crop
            }
            break
        }
      }
    },
    endRound() {
      this.$socket.emit('endRound');
    },
    startRound() {
      this.$socket.emit('startRound');
    },
    reset() {
      this.$socket.emit('reset');
      this.cash = 9;
    }
  }
}
</script>

<template>
  <div>
    <h2>Cash: {{ cash }} </h2>
    <h3>Players: {{ players }} </h3>
    <table>
      <tr>
        <th>Corn</th>
        <th>DF</th>
        <th>Kamote</th>
      </tr>
      <tr>
        <td>${{ cornPrice }}</td>
        <td>${{ dfPrice }}</td>
        <td>${{ kamotePrice }}</td>
      </tr>
    </table>
    <table v-if="inGame">
      <tr v-for="i in 3">
        <td v-for="j in 3">
          <GamePlot :row="i - 1" :column="j - 1" @plantSeed="plantSeed">{{ crops[i - 1][j - 1] }}</GamePlot>
        </td>
      </tr>
    </table>
    <button v-if="!inGame" v-on:click="startRound()">Start Round</button>
    <button v-if="inGame" v-on:click="endRound()">End Round</button>
    <button v-on:click="reset()">Reset</button>
  </div>

</template>

<style scoped>

</style>
