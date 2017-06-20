from ethjsonrpc import EthJsonRpc
from time import sleep

c = EthJsonRpc('127.0.0.1', 1337)

# Status address - 0x55d34b686aa8C04921397c5807DB9ECEdba00a4c
# Gas limit - 200k
# Max gas price - 50 GWei

transactions = ['0x1'] # List of signed transactions

crowdsaleStart = 3903900 # 3903900 - block number for Status crowdsale start

currentBlock = c.eth_blockNumber()
while currentBlock < crowdsaleStart-2:
    toSleep = max(crowdsaleStart - currentBlock - 3, 0) # Sleep either crowdsaleStart - currentBlock - 3 seconds or 0 seconds
    print('currentBlock: %d\tblocksUntilSending: %d\tcrowdsaleStart: %d\tSleeping for %ds' % (currentBlock, crowdsaleStart-currentBlock-2, crowdsaleStart, toSleep))

    sleep(toSleep)
    currentBlock = c.eth_blockNumber() # Get the current block number

# As soon as currentBlock >= crowdsaleStart-2 the script starts to broadcast the signed transactions

# Loop over transactions to broadcast
for t in transactions:
    try:
        result = c.eth_sendRawTransaction(t)
        print(result)
    except Exception as e:
        print('Error broadcasting: %s\t%r' % (t, e))

