import { log, BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

import { Perpetual, LiquidityPool, User } from '../generated/schema'

import { Oracle as OracleContract } from '../generated/templates/LiquidityPool/Oracle'
import { USDTokens, OracleMap } from './const'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export function isUSDToken(collateral: string): boolean {
  for (let i = 0; i < USDTokens.length; i++) {
    if (collateral == USDTokens[i]) {
      return true
    }
  }
  return false
}

export function fetchUser(address: Address): User {
  let user = User.load(address.toHexString())
  if (user === null) {
    user = new User(address.toHexString())
    user.isTrade = false
    user.liquidity = ZERO_BD
    user.tradeVolume = ZERO_BD
    user.liquidityAge = ZERO_BI
    user.liquidityLastAddTime = ZERO_BI
    user.save()
  }
  return user as User
}

export function fetchPerpetual(liquidityPool: LiquidityPool, perpetualIndex: BigInt): Perpetual {
  let id = liquidityPool.id.concat('-').concat(perpetualIndex.toString())
  let perp = Perpetual.load(id)
  if (perp === null) {
    perp = new Perpetual(id)
    perp.index = perpetualIndex
    perp.collateralAddress = liquidityPool.collateralAddress
    perp.liquidityPool = liquidityPool.id
    perp.createdAtTimestamp = ZERO_BI
    perp.createdAtBlockNumber = ZERO_BI
    perp.save()
  }
  return perp as Perpetual
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function convertToDecimal(amount: BigInt, decimals: BigInt): BigDecimal {
  if (decimals == ZERO_BI) {
    return amount.toBigDecimal()
  }
  return amount.toBigDecimal().div(exponentToBigDecimal(decimals))
}

export function AbsBigDecimal(x: BigDecimal): BigDecimal {
  if (x >= ZERO_BD) {
    return x
  }
  return -x
}

function getPriceFromOracle(token: string): BigDecimal {
  let oracle = OracleMap.get(token) as string
  if (oracle == null) {
    return ZERO_BD
  }
  let contract = OracleContract.bind(Address.fromString(oracle))
  let callResult = contract.try_priceTWAPShort()
  if(callResult.reverted){
      log.warning("try_priceTWAPShort reverted. oracle: {}", [oracle])
      return ZERO_BD
  }

  return convertToDecimal(callResult.value.value0, BI_18)
}

export function getTokenPrice(token: string): BigDecimal {
  if (isUSDToken(token)) {
    return ONE_BD
  }

  let price = getPriceFromOracle(token)
  return price
}
