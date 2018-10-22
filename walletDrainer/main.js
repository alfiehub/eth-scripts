const readlineSync = require('readline-sync')

const Web3 = require('web3')
const ethTokens = require('./ethTokens.json')
const tokenAbi = require('./tokenAbi.json')

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:12345'))
const me = ''
const to = ''

const toWei = (num, decimals) => Math.floor(num * Math.pow(10, decimals))

function getNonce() {
  return web3.eth.getTransactionCount(me)
}

async function sendToken (token, nonce, data) {
  const signed = await web3.eth.signTransaction({
    from: me,
    nonce: nonce,
    chainId: '1',
    to: token.address,
    data: data,
    value: 0,
    gas: 100000,
    gasPrice: 10*Math.pow(10, 9)
  }, me)
  web3.eth.sendSignedTransaction(signed.raw, (err, res) => console.log(`Submitted tx with id: ${res}. Error: ${err}`))
}

async function main () {
  let nonce = await getNonce()
  for (let i = 0; i < ethTokens.length; i++) {
    const token = ethTokens[i]
    const tokenDecimal = parseInt(token.decimal)
    console.log(`Checking token with symbol ${token.symbol}`)

    const contract = new web3.eth.Contract(tokenAbi, token.address)
    const decimals = await contract.methods.balanceOf(me).call()

    const balance = parseFloat(decimals) / Math.pow(10, token.decimal)

    if (balance > 0) {
      console.log(`${token.symbol}: ${balance}`)
      var ans = readlineSync.question('Do you want to transfer this token? Y/n\n')

      if (ans === 'n') {
        continue
      }

      const data = contract.methods.transfer.apply(this, [to, decimals]).encodeABI()
      await sendToken(token, nonce, data)
      nonce++
    }
  }
}

main()
