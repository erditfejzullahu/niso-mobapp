
import Big from "big.js"

export function toFixedNoRound(num: string, decimals: number): string {
    return new Big(num).toFixed(decimals, Big.roundDown);
}