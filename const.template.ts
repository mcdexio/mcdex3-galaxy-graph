
import { TypedMap } from '@graphprotocol/graph-ts'

// Notice lower case in config
// added ["USDT", "USDC", "DAI"]
export let USDTokens:string[] = [
    "{{usdc_token}}",
]

// !!!!!!!!!!!!!!  Notice Lower Case  !!!!!!!!!!!!!!
export let OracleMap = new TypedMap<string, string>();
OracleMap.set("{{eth_token}}", "{{eth_oracle}}")
