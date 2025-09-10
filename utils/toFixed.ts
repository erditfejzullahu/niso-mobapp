
import Big from "big.js"

export function toFixedNoRound(num: string | number | null, decimals: number): string {
    if(num === null || num === undefined || num === "") {
        return '0.' + '0'.repeat(decimals);
    }
    return new Big(num).toFixed(decimals, Big.roundDown);
}