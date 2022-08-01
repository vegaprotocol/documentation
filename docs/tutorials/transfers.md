---
title: Transfers
hide_title: false
---

## One-off transfers
### One-off transfer to Vega key
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{"transfer":{"fromAccountType":4,"toAccountType":4,"to":"7a18ca62128f637fb067aa79c796f6925808fa697f7862d1fed89f9195cf906f","asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55","amount":"10000000000000000000","oneOff":{"deliverOn":0}}}' (deliver on in utc seconds) 

To schedule a transfer for later, change the deliver-on 

### One-off transfer to reward pool
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{"transfer":{"fromAccountType":4,"toAccountType":12,"to":"0000000000000000000000000000000000000000000000000000000000000000","asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55","amount":"10000000000000000000","oneOff":{"deliverOn":0}}}' (deliver on in utc seconds) 

## Recurring transfers

### Recurring transfer to Vega key
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{"transfer":{"fromAccountType":4,"toAccountType":4,"to":"KEY","asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55","amount":"10000000000000000000","recurring":{"startEpoch":0, "endEpoch":"2", "factor":}}}' (deliver on in utc seconds)

percentage of full reward amount you specified that you want to pay each time to vega key

### Recurring transfer to reward pool 
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{"transfer":{"fromAccountType":4,"toAccountType":12,"to":"0000000000000000000000000000000000000000000000000000000000000000","asset":"fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55","amount":"10000000000000000000","recurring":{"startEpoch":0, "endEpoch":"2", "factor":}}}' (deliver on in utc seconds) 

percentage of full reward amount you specified that you want to pay each time to reward pool
factor, decimal > 1.0 (a factor used with the amount specified for the transfer).

### Cancelling recurring transfers
vegawallet command send --wallet "wallet-name" --pubkey "pubkey" --network fairground '{ "cancelTransfer": "transfer_id" }'


-how to get transfer ID? 


