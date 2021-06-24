import { BigInt, BigDecimal, ethereum, log, Address } from "@graphprotocol/graph-ts"

import { LiquidityPool, Perpetual, Trade, User } from '../generated/schema'

import { 
    CreatePerpetual as CreatePerpetualEvent,
    AddLiquidity as AddLiquidityEvent,
    RemoveLiquidity as RemoveLiquidityEvent,
    Trade as TradeEvent,
} from '../generated/templates/LiquidityPool/LiquidityPool'

import {
    ZERO_BD,
    BI_18,
    fetchUser,
    convertToDecimal,
    fetchPerpetual,
    AbsBigDecimal,
    getTokenPrice,
    ZERO_BI
} from './utils'

export function handleCreatePerpetual(event: CreatePerpetualEvent): void {
    let liquidityPool = LiquidityPool.load(event.address.toHexString())
    let perp = fetchPerpetual(liquidityPool as LiquidityPool, event.params.perpetualIndex)
    perp.createdAtTimestamp = event.block.timestamp
    perp.createdAtBlockNumber = event.block.number
    perp.save()
}

export function handleAddLiquidity(event: AddLiquidityEvent): void {
    let liquidityPool = LiquidityPool.load(event.address.toHexString())
    let user = fetchUser(event.params.trader)
    let cash = convertToDecimal(event.params.addedCash, BI_18)
    user.collateralAmount += cash
    // to USD
    let tokenPrice = getTokenPrice(liquidityPool.collateralAddress)
    let cashUSD = cash.times(tokenPrice)
    user.collateralAmountUSD += cashUSD


    // provide liquidity to any pool for more than $500 for more than 7 days
    if (user.collateralAmountUSD >= BigDecimal.fromString('500')) {
        user.liquidityTarget1Triggered = true
        if (user.updatedAtTarget1 > ZERO_BI) {
            user.ageTarget1 = event.block.timestamp - user.updatedAtTarget1
        }
        user.updatedAtTarget1 = event.block.timestamp
    }

    // provide $2000 worth of liquidity to any liquidity pool in a single transaction for more than 14 days
    if (cashUSD >= BigDecimal.fromString('2000')) {
        user.liquidityTarget2Triggered = true
        if (user.updatedAtTarget2 > ZERO_BI) {
            user.ageTarget2 = event.block.timestamp - user.updatedAtTarget2
        }
        user.updatedAtTarget2 = event.block.timestamp
    }

    // provide $5000 worth of liquidity to any liquidity pool in a single transaction for more than 14 days
    if (cashUSD >= BigDecimal.fromString('5000')) {
        user.liquidityTarget3Triggered = true
        if (user.updatedAtTarget3 > ZERO_BI) {
            user.ageTarget3 = event.block.timestamp - user.updatedAtTarget3
        }
        user.updatedAtTarget3 = event.block.timestamp
    }

    user.save()
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
    let liquidityPool = LiquidityPool.load(event.address.toHexString())
    let user = fetchUser(event.params.trader)
    let cash = convertToDecimal(event.params.returnedCash, BI_18)
    user.collateralAmount = user.collateralAmount.minus(cash)
    let tokenPrice = getTokenPrice(liquidityPool.collateralAddress)
    let cashUSD = user.collateralAmount.times(tokenPrice)
    user.collateralAmountUSD -= cashUSD

    if (user.updatedAtTarget3 > ZERO_BI) {
        if (user.collateralAmountUSD < BigDecimal.fromString('5000')) {
            user.ageTarget3 = event.block.timestamp - user.updatedAtTarget3
            user.updatedAtTarget3 = ZERO_BI
        }
    }

    if (user.updatedAtTarget2 > ZERO_BI) {
        if (user.collateralAmountUSD < BigDecimal.fromString('2000')) {
            user.ageTarget2 = event.block.timestamp - user.updatedAtTarget2
            user.updatedAtTarget2 = ZERO_BI
        }
    }

    if (user.updatedAtTarget1 > ZERO_BI) {
        if (user.collateralAmountUSD < BigDecimal.fromString('500')) {
            user.ageTarget1 = event.block.timestamp - user.updatedAtTarget1
            user.updatedAtTarget1 = ZERO_BI
        }
    }

    user.save()
}

export function handleTrade(event: TradeEvent): void {
    let liquidityPool = LiquidityPool.load(event.address.toHexString())
    let id = event.address.toHexString()
        .concat('-')
        .concat(event.params.perpetualIndex.toString())
    let perp = Perpetual.load(id)

    let trader = fetchUser(event.params.trader)
    let transactionHash = event.transaction.hash.toHexString()
    let price = convertToDecimal(event.params.price, BI_18)
    let position = convertToDecimal(event.params.position, BI_18)
    let fee = convertToDecimal(event.params.fee, BI_18)

    let trade = new Trade(
        transactionHash
        .concat('-')
        .concat(event.logIndex.toString())
    )
    trade.perpetual = perp.id
    trade.trader = trader.id
    trade.amount = position
    trade.price = price
    trade.fee = fee
    trade.transactionHash = transactionHash
    trade.blockNumber = event.block.number
    trade.timestamp = event.block.timestamp
    trade.logIndex = event.logIndex

    let volume = AbsBigDecimal(position).times(price)
    let volumeUSD = ZERO_BD
    // to USD
    let tokenPrice = getTokenPrice(liquidityPool.collateralAddress)
    volumeUSD = volume.times(tokenPrice)
    trade.volume = volume
    trade.volumeUSD = volumeUSD
    trade.save()
    if (!trader.isTrade) {
        trader.isTrade = true
        trader.save()

    }
}
