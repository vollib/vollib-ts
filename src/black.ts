import {
  black as lbrBlack,
  impliedVolatilityFromATransformedRationalGuess,
  normalizedBlack as lbrNormalizedBlack,
  normalizedImpliedVolatilityFromATransformedRationalGuess
} from "lets-be-rational";
import { binaryFlag, OptionFlag } from "./helpers.js";

export function undiscountedBlack(F: number, K: number, sigma: number, t: number, flag: OptionFlag): number {
  return lbrBlack(F, K, sigma, t, binaryFlag(flag));
}

export function black(flag: OptionFlag, F: number, K: number, t: number, r: number, sigma: number): number {
  return undiscountedBlack(F, K, sigma, t, flag) * Math.exp(-r * t);
}

export function normalisedBlack(x: number, s: number, flag: OptionFlag): number {
  return lbrNormalizedBlack(x, s, binaryFlag(flag));
}

export const normalizedBlack = normalisedBlack;

export function impliedVolatilityOfUndiscountedOptionPrice(
  undiscountedOptionPrice: number,
  F: number,
  K: number,
  t: number,
  flag: OptionFlag
): number {
  return impliedVolatilityFromATransformedRationalGuess(undiscountedOptionPrice, F, K, t, binaryFlag(flag));
}

export function impliedVolatilityOfDiscountedOptionPrice(
  discountedOptionPrice: number,
  F: number,
  K: number,
  r: number,
  t: number,
  flag: OptionFlag
): number {
  return impliedVolatilityOfUndiscountedOptionPrice(discountedOptionPrice / Math.exp(-r * t), F, K, t, flag);
}

export const impliedVolatility = impliedVolatilityOfDiscountedOptionPrice;

export function normalisedImpliedVolatility(beta: number, x: number, flag: OptionFlag): number {
  return normalizedImpliedVolatilityFromATransformedRationalGuess(beta, x, binaryFlag(flag));
}

export const normalizedImpliedVolatility = normalisedImpliedVolatility;
