import { impliedVolatilityFromATransformedRationalGuess } from "lets-be-rational";
import { undiscountedBlack } from "./black.js";
import { assertPositiveStrike, binaryFlag, OptionFlag } from "./helpers.js";

export function blackScholes(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number): number {
  const deflater = Math.exp(-r * t);
  const F = S / deflater;
  return undiscountedBlack(F, K, sigma, t, flag) * deflater;
}

export function impliedVolatility(price: number, S: number, K: number, t: number, r: number, flag: OptionFlag): number {
  assertPositiveStrike(K);
  const deflater = Math.exp(-r * t);
  const F = S / deflater;
  return impliedVolatilityFromATransformedRationalGuess(price / deflater, F, K, t, binaryFlag(flag));
}
