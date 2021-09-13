
## Install

update config/mainnet.json
update package.json settings to point to your own graph account.
```
yarn install
yarn prepare:mainnet
yarn codegen
yarn deploy-local
```

# Task: placed one trade
## Endpoint:
```
    https://api.thegraph.com/subgraphs/name/mcdexio/galaxy
```
## Query
GraphQL query
```
  query getUserHasTrade($adress: String!) {
      user(id: $address) {
          id
          isTrade
      }
  }
```
## Expression
if isTrade is true，it means the user has placed one trade

# Task: query trade volume
## Endpoint:
```
    https://api.thegraph.com/subgraphs/name/mcdexio/galaxy
```
## Query
```
  query getUserTradeVolume($adress: String!) {
      user(id: $address) {
          id
          tradeVolume
      }
  }
```
## Expression
tradeVolume is user's Cumulative trade volume

# Task: liquidity that user provide and duration
## Endpoint:
```
    https://api.thegraph.com/subgraphs/name/mcdexio/galaxy
```
## Query
GraphQL query
```
  query getUserLiquidity($adress: String!) {
      user(id: $address) {
          id
          liquidity
          liquidityAge
          liquidityLastAddTime
      }
  }
```
## Expression
```
function(data) {
  const liquidity = data.data.user.liquidity
  if (liquidity < 5000) {
    return liquidity, false
  }
  const now = Math.floor(Date.now() / 1000)
  let age = data.data.user.liquidityAge 
  let updatedAt = data.data.user.liquidityLastAddTime
  nowAge = age
  if (updatedAt > 0) {
    nowAge = nowAge + now - updatedAt
  }
  if (nowAge > 7*60*60*24) { // 7 day
    return liquidity, true
  }
  
  return liquidity, false
}
```
