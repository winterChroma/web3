<template>
  <div>
    <!-- "connect" click event is registered -->
    <button v-if="!connected" @click="connect">Connect wallet</button>
    <button v-if="connected">Call contract</button>
    {{ contractResult }}
  </div>
</template>

<style scoped>
.metamask-connect {
  display: inline-block;
  position: relative;
  left: 210px;
  top: 50px;
}
</style>
  
<script>
import Web3 from 'web3'

const web3 = new Web3("http://127.0.0.1:7545")

// Get the balance of an Ethereum address
//const balance = await web3.eth.getBalance("0x3Ec999aC8d6a36e9aCec148a646188db4983fBaa")
//console.log(Number(balance))

export default {
  name: 'WalletConnect',

  data() {
    return {
      connected: false,
      contractResult: '',
    }
  },
  methods: {
    connect: function () {
      // this connects to the wallet

      if (window.ethereum) { // first we check if metamask is installed
        window.ethereum.request({ method: 'eth_requestAccounts' })
          .then(() => {
            this.connected = true; // If users successfully connected their wallet
          });
      }
    }
  }
}
</script>