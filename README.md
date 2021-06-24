
## Install

update config/mainnet.json
update package.json settings to point to your own graph account.
```
yarn install
yarn prepare:mainnet
yarn codegen
yarn deploy-local
```

# 指标: placed one trade
## Endpoint:
```
    https://graph-arb-kovan5.mcdex.io/subgraphs/name/mcarloai/mcdex3-galaxy
```
## Query
GraphQL query, 这个query可以接收一个address参数, 用来查询这个地址的信息
```
  query getUserHasTrade($adress: String!) {
      user(id: $address) {
          id
          isTrade
      }
  }
```
## Expression
解析graphql的response, 用js编写, 使用js严格模式, 这个函数接收一个data参数, data就是query response,
isTrade为true，表示place one trade

# 指标: placed an order with the value of more than $2000 and matched
## Endpoint:
```
    https://graph-arb-kovan5.mcdex.io/subgraphs/name/mcarloai/mcdex3-galaxy
```
## Query
GraphQL query, 这个query可以接收一个address参数, 用来查询这个地址的信息
```
  query getUserOrderMatchedThan2000($adress: String!) {
      user(id: $address) {
          id
          matchedOrderTarget1
      }
  }
```
## Expression
解析graphql的response, 用js编写, 使用js严格模式, 这个函数接收一个data参数, data就是query response,
matchedOrderTarget1为true，表示placed an order with the value of more than $2000 and matched

# 指标: placed an order with the value of more than $5000 and matched
## Endpoint:
```
    https://graph-arb-kovan5.mcdex.io/subgraphs/name/mcarloai/mcdex3-galaxy
```
## Query
GraphQL query, 这个query可以接收一个address参数, 用来查询这个地址的信息
```
  query getUserOrderMatchedThan5000($adress: String!) {
      user(id: $address) {
          id
          matchedOrderTarget2
      }
  }
```
## Expression
解析graphql的response, 用js编写, 使用js严格模式, 这个函数接收一个data参数, data就是query response,
matchedOrderTarget2为true，表示placed an order with the value of more than $5000 and matched

# 指标: placed an order with the value of more than $10000 and matched
## Endpoint:
```
    https://graph-arb-kovan5.mcdex.io/subgraphs/name/mcarloai/mcdex3-galaxy
```
## Query
GraphQL query, 这个query可以接收一个address参数, 用来查询这个地址的信息
```
  query getUserOrderMatchedThan10000($adress: String!) {
      user(id: $address) {
          id
          matchedOrderTarget3
      }
  }
```
## Expression
解析graphql的response, 用js编写, 使用js严格模式, 这个函数接收一个data参数, data就是query response,
matchedOrderTarget3为true，表示placed an order with the value of more than $10000 and matched

# 指标: provide liquidity to any pool for more than $500 for more than 7 days
## Endpoint:
```
    https://graph-arb-kovan5.mcdex.io/subgraphs/name/mcarloai/mcdex3-galaxy
```
## Query
GraphQL query, 这个query可以接收一个address参数, 用来查询这个地址的信息
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
解析graphql的response, 用js编写, 使用js严格模式, 这个函数接收一个data参数, data就是query response,
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

# 指标: provide $2000 worth of liquidity to any liquidity pool in a single transaction for more than 14 days
## Endpoint:
```
    https://graph-arb-kovan5.mcdex.io/subgraphs/name/mcarloai/mcdex3-galaxy
```
## Query
GraphQL query, 这个query可以接收一个address参数, 用来查询这个地址的信息
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
解析graphql的response, 用js编写, 使用js严格模式, 这个函数接收一个data参数, data就是query response,
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

# 指标: provide $5000 worth of liquidity to any liquidity pool in a single transaction for more than 14 days
## Endpoint:
```
    https://graph-arb-kovan5.mcdex.io/subgraphs/name/mcarloai/mcdex3-galaxy
```
## Query
GraphQL query, 这个query可以接收一个address参数, 用来查询这个地址的信息
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
解析graphql的response, 用js编写, 使用js严格模式, 这个函数接收一个data参数, data就是query response,
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