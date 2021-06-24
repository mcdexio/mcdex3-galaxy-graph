import { TypedMap, BigInt, BigDecimal, ethereum, log, Address } from "@graphprotocol/graph-ts"

import { LiquidityPool } from '../generated/schema'

import { CreateLiquidityPool } from '../generated/Factory/Factory'

import { 
    LiquidityPool as LiquidityPoolTemplate,
} from '../generated/templates'

export function handleCreateLiquidityPool(event: CreateLiquidityPool): void {
    let liquidityPool = new LiquidityPool(event.params.liquidityPool.toHexString())
    liquidityPool.collateralAddress = event.params.collateral.toHexString()
    liquidityPool.createdAtTimestamp = event.block.timestamp
    liquidityPool.createdAtBlockNumber = event.block.number
    liquidityPool.save()

    // create the tracked contract based on the template
    LiquidityPoolTemplate.create(event.params.liquidityPool)
}
