
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

# Task: placed an order with the value of more than $2000 and matched
## Endpoint:
```
    https://api.thegraph.com/subgraphs/name/mcdexio/galaxy
```
## Query
```
  query getUserOrderMatchedThan2000($adress: String!) {
      user(id: $address) {
          id
          matchedOrderTarget1
      }
  }
```
## Expression
if matchedOrderTarget1 is true，it means placed an order with the value of more than $2000 and matched

# Task: placed an order with the value of more than $5000 and matched
## Endpoint:
```
    https://api.thegraph.com/subgraphs/name/mcdexio/galaxy
```
## Query
```
  query getUserOrderMatchedThan5000($adress: String!) {
      user(id: $address) {
          id
          matchedOrderTarget2
      }
  }
```
## Expression
if matchedOrderTarget2 is true，it means placed an order with the value of more than $5000 and matched

# Task: placed an order with the value of more than $10000 and matched
## Endpoint:
```
    https://api.thegraph.com/subgraphs/name/mcdexio/galaxy
```
## Query
```
  query getUserOrderMatchedThan10000($adress: String!) {
      user(id: $address) {
          id
          matchedOrderTarget3
      }
  }
```
## Expression
if matchedOrderTarget3 is true，it means placed an order with the value of more than $10000 and matched

# Task: provide liquidity to any pool for more than $500 for more than 7 days
## Endpoint:
```
    https://api.thegraph.com/subgraphs/name/mcdexio/galaxy
```
## Query
```
  query getUserAddLiquidityMoreThan500($adress: String!) {
      user(id: $address) {
          id
          liquidityTarget1Triggered
          ageTarget1
          updatedAtTarget1
      }
  }
```
## Expression
```
function(data) {
  const triggered = data.data.user.liquidityTarget1Triggered
  let totalTime = 0
  if (!triggered) {
    return false
  }
  const now = Math.floor(Date.now() / 1000)
  let age = data.data.user.ageTarget1 
  let updatedAt = data.data.user.updatedAtTarget1
  nowAge = age
  if (updatedAt > 0) {
    nowAge = nowAge + now - updatedAt
  }
  if (nowAge > 7*60*60*24) { // 7 day
    return true
  }
}
```

# Task: provide $2000 worth of liquidity to any liquidity pool in a single transaction for more than 14 days
## Endpoint:
```
    https://api.thegraph.com/subgraphs/name/mcdexio/galaxy
```
## Query
GraphQL query
```
  query getUserAddLiquidityMoreThan2000($adress: String!) {
      user(id: $address) {
          id
          liquidityTarget2Triggered
          ageTarget2
          updatedAtTarget2
      }
  }
```
## Expression
```
function(data) {
  const triggered = data.data.user.liquidityTarget2Triggered
  let totalTime = 0
  if (!triggered) {
    return false
  }
  const now = Math.floor(Date.now() / 1000)
  let age = data.data.user.ageTarget2 
  let updatedAt = data.data.user.updatedAtTarget2
  nowAge = age
  if (updatedAt > 0) {
    nowAge = nowAge + now - updatedAt
  }
  if (nowAge > 14*60*60*24) { // 14 day
    return true
  }
}
```

# Task: provide $5000 worth of liquidity to any liquidity pool in a single transaction for more than 14 days
## Endpoint:
```
    https://api.thegraph.com/subgraphs/name/mcdexio/galaxy
```
## Query
GraphQL query
```
  query getUserAddLiquidityMoreThan2000($adress: String!) {
      user(id: $address) {
          id
          liquidityTarget3Triggered
          ageTarget3
          updatedAtTarget3
      }
  }
```
## Expression
```
function(data) {
  const triggered = data.data.user.liquidityTarget3Triggered
  let totalTime = 0
  if (!triggered) {
    return false
  }
  const now = Math.floor(Date.now() / 1000)
  let age = data.data.user.ageTarget3
  let updatedAt = data.data.user.updatedAtTarget3
  nowAge = age
  if (updatedAt > 0) {
    nowAge = nowAge + now - updatedAt
  }
  if (nowAge > 14*60*60*24) { // 14 day
    return true
  }
}
```
