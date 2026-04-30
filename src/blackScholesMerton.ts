import { black as lbrBlack, impliedVolatilityFromATransformedRationalGuess } from "lets-be-rational";
import { assertPositiveStrike, binaryFlag, OptionFlag } from "./helpers.js";

export function blackScholesMerton(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number, q: number): number {
  assertPositiveStrike(K);
  const F = S * Math.exp((r - q) * t);
  return lbrBlack(F, K, sigma, t, binaryFlag(flag)) * Math.exp(-r * t);
}

export function impliedVolatility(price: number, S: number, K: number, t: number, r: number, q: number, flag: OptionFlag): number {
  assertPositiveStrike(K);
  const F = S * Math.exp((r - q) * t);
  return impliedVolatilityFromATransformedRationalGuess(price / Math.exp(-r * t), F, K, t, binaryFlag(flag));
}
