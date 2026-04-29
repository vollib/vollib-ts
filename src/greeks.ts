import { normCdf, normPdf } from "lets-be-rational";
import { black } from "./black.js";
import { blackScholes } from "./blackScholes.js";
import { blackScholesMerton } from "./blackScholesMerton.js";
import { d1, d2, OptionFlag } from "./helpers.js";

export function blackDelta(flag: OptionFlag, F: number, K: number, t: number, r: number, sigma: number): number {
  const D1 = d1(F, K, t, sigma);
  return flag === "p" ? -Math.exp(-r * t) * normCdf(-D1) : Math.exp(-r * t) * normCdf(D1);
}

export function blackGamma(F: number, K: number, t: number, r: number, sigma: number): number {
  return Math.exp(-r * t) * normPdf(d1(F, K, t, sigma)) / (F * sigma * Math.sqrt(t));
}

export function blackVega(F: number, K: number, t: number, r: number, sigma: number): number {
  return F * Math.exp(-r * t) * normPdf(d1(F, K, t, sigma)) * Math.sqrt(t) * 0.01;
}

export function blackScholesDelta(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number): number {
  const F = S * Math.exp(r * t);
  return flag === "p" ? normCdf(d1(F, K, t, sigma)) - 1 : normCdf(d1(F, K, t, sigma));
}

export function blackScholesMertonDelta(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number, q: number): number {
  const F = S * Math.exp((r - q) * t);
  const D1 = d1(F, K, t, sigma);
  return flag === "p" ? -Math.exp(-q * t) * normCdf(-D1) : Math.exp(-q * t) * normCdf(D1);
}

export function numericalDelta(model: "black" | "black-scholes" | "black-scholes-merton", flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number, q = 0): number {
  const dS = 0.01;
  const price = (spot: number): number => {
    if (model === "black") return black(flag, spot, K, t, r, sigma);
    if (model === "black-scholes") return blackScholes(flag, spot, K, t, r, sigma);
    return blackScholesMerton(flag, spot, K, t, r, sigma, q);
  };
  return (price(S + dS) - price(S - dS)) / (2 * dS);
}

export { d1, d2 };
