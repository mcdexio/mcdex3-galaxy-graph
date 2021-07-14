import { BigInt, BigDecimal, ethereum, log, Address } from "@graphprotocol/graph-ts"

import {
    TradeSuccess as TradeSuccessEvent,
} from '../generated/Broker/Broker'

import { MatchOrder, LiquidityPool } from '../generated/schema'

import {
    fetchUser,
    BI_18,
    convertToDecimal,
    fetchPerpetual,
    getTokenPrice,
    AbsBigDecimal
} from './utils'

export function handleTradeSuccess(event: TradeSuccessEvent): void {
    let liquidityPool = LiquidityPool.load(event.params.order.liquidityPool.toHexString())
    if (liquidityPool === null) {
        return
    }
    let perp = fetchPerpetual(liquidityPool as LiquidityPool, event.params.order.perpetualIndex)
    let trader = fetchUser(event.params.order.trader)
    let transactionHash = event.transaction.hash.toHexString()
    let order = new MatchOrder(
        transactionHash
        .concat('-')
        .concat(event.logIndex.toString())
    )
    order.perpetual = perp.id
    order.trader = trader.id
    order.orderHash = event.params.orderHash.toHexString()
    order.amount = convertToDecimal(event.params.amount, BI_18)
    order.type = 1
    order.gas = convertToDecimal(event.params.gasReward, BI_18)
    order.transactionHash = transactionHash
    order.blockNumber = event.block.number
    order.timestamp = event.block.timestamp
    order.logIndex = event.logIndex

    let price = convertToDecimal(event.params.order.limitPrice, BI_18)
    order.price = price
    let volume = AbsBigDecimal(order.amount).times(price)
    order.volume = volume
    // to USD
    let tokenPrice = getTokenPrice(liquidityPool.collateralAddress)
    let volumeUSD = volume.times(tokenPrice)
    order.volumeUSD = volumeUSD
    order.save()

    if (volumeUSD >= BigDecimal.fromString('10000')) {
        trader.matchedOrderTarget1 = true
        trader.matchedOrderTarget2 = true
        trader.matchedOrderTarget3 = true
        trader.save()
    } else if (volumeUSD >= BigDecimal.fromString('5000')) {
        trader.matchedOrderTarget1 = true
        trader.matchedOrderTarget2 = true
        trader.save()
    } else if (volumeUSD >= BigDecimal.fromString('2000')) {
        trader.matchedOrderTarget1 = true
        trader.save()
    }
}

