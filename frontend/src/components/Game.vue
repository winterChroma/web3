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
    <div class="player-count">
      <span class="info-layout__key md">Number of Players:</span>
      <span class="info-layout__value md">{{ players }}</span>
    </div>
    <div class="info-layout">
      <div class="info-layout__section">
        <span clss="info-layout__key">Wallet:</span>
        <span class="info-layout__value">{{ cash }} (FRM)</span>
      </div>
    </div>
    <div class="info-layout">
      <div class="info-layout__section md">PRICE LIST</div>
      <div class="info-layout__section">
        <span clss="info-layout__key">CORN</span>
        <span class="info-layout__value">: ${{ cornPrice }}</span>
      </div>
      <div class="info-layout__section">
        <span clss="info-layout__key">Tomato</span>
        <span class="info-layout__value">: ${{ dfPrice }}</span>
      </div>
      <div class="info-layout__section">
        <span clss="info-layout__key">Eggplant</span>
        <span class="info-layout__value">: ${{ kamotePrice }}</span>
      </div>
    </div>
    <table v-if="inGame">
      <tr v-for="i in 3">
        <td v-for="j in 3">
          <GamePlot :row="i - 1" :column="j - 1" @plantSeed="plantSeed">
            <img v-if="crops[i - 1][j - 1] === 'corn'" src="../assets/corn-emoji.png" class="crop-icon"></img>
            <img v-else-if="crops[i - 1][j - 1] === 'df'" src="../assets/tomato-emoji.png" class="crop-icon"></img>
            <img v-else-if="crops[i - 1][j - 1] === 'kamote'" src="../assets/eggplant-emoji.png"
              class="crop-icon"></img>
          </GamePlot>
        </td>
      </tr>
    </table>
    <div class="btn-container">
      <button v-if="!inGame" v-on:click="startRound()" class="btn-md">Start Round</button>
      <button v-if="inGame" v-on:click="endRound()" class="btn-md">End Round</button>
      <button v-on:click="reset()" class="btn-md">Reset</button>
    </div>
  </div>

</template>

<style scoped>
.info-layout {
  background-color: #EAD1A1;
  position: relative;
  top: 50px;
  margin-left: 60%;
  margin-top: 50px;
  border: 2px solid;
  width: 300px;
}

.info-layout__section {
  width: 100%;
  display: inline-block;
  border: 2px solid;
}

.info-layout__value {
  margin: 2px;
  margin-left: 4px;
  width: 100px;
}

.info-layout__key {
  margin: 2px;
  border: 1px solid;
  width: 200px;
}

.player-count {
  position: relative;
  display: inline-block;
  top: 50px;
  left: 50px;
  background-color: #EAD1A1;
  border: 1px solid;
}

.md {
  font-size: 24px;
  font-weight: 400;
}

.crop-icon {
  position: relative;
  display: block;
  left: 28px;
  margin: 4px;
}

.btn-md {
  height: 45px;
  width: 140px;
  margin: 5px;
  display: inline-block;
  padding-bottom: 40px;
}

.btn-container {
  position: relative;
  left: 140px;
}
</style>
