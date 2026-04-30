export type OptionFlag = "c" | "p";

export function binaryFlag(flag: OptionFlag): 1 | -1 {
  if (flag === "c") return 1;
  if (flag === "p") return -1;
  throw new Error(`Expected option flag "c" or "p", got ${flag}`);
}

export function assertPositiveStrike(K: number): void {
  if (K <= 0) {
    throw new RangeError(`Strike price K must be strictly positive, got ${K}`);
  }
}

export function d1(F: number, K: number, t: number, sigma: number): number {
  assertPositiveStrike(K);
  return (Math.log(F / K) + 0.5 * sigma * sigma * t) / (sigma * Math.sqrt(t));
}

export function d2(F: number, K: number, t: number, sigma: number): number {
  return d1(F, K, t, sigma) - sigma * Math.sqrt(t);
}
