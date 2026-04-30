import { normCdf, normPdf } from "lets-be-rational";
import { black } from "./black.js";
import { blackScholes } from "./blackScholes.js";
import { blackScholesMerton } from "./blackScholesMerton.js";
import { assertPositiveStrike, d1, d2, OptionFlag } from "./helpers.js";

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

export function blackTheta(flag: OptionFlag, F: number, K: number, t: number, r: number, sigma: number): number {
  const D1 = d1(F, K, t, sigma);
  const D2 = d2(F, K, t, sigma);
  const discount = Math.exp(-r * t);
  const firstTerm = F * discount * normPdf(D1) * sigma / (2 * Math.sqrt(t));

  if (flag === "c") {
    const secondTerm = -r * F * discount * normCdf(D1);
    const thirdTerm = r * K * discount * normCdf(D2);
    return -(firstTerm + secondTerm + thirdTerm) / 365;
  }

  const secondTerm = -r * F * discount * normCdf(-D1);
  const thirdTerm = r * K * discount * normCdf(-D2);
  return (-firstTerm + secondTerm + thirdTerm) / 365;
}

export function blackRho(flag: OptionFlag, F: number, K: number, t: number, r: number, sigma: number): number {
  return -t * black(flag, F, K, t, r, sigma) * 0.01;
}

export function blackScholesDelta(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number): number {
  const F = S * Math.exp(r * t);
  return flag === "p" ? normCdf(d1(F, K, t, sigma)) - 1 : normCdf(d1(F, K, t, sigma));
}

export function blackScholesGamma(S: number, K: number, t: number, r: number, sigma: number): number {
  const F = S * Math.exp(r * t);
  return normPdf(d1(F, K, t, sigma)) / (S * sigma * Math.sqrt(t));
}

export function blackScholesVega(S: number, K: number, t: number, r: number, sigma: number): number {
  const F = S * Math.exp(r * t);
  return S * normPdf(d1(F, K, t, sigma)) * Math.sqrt(t) * 0.01;
}

export function blackScholesTheta(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number): number {
  const F = S * Math.exp(r * t);
  const D1 = d1(F, K, t, sigma);
  const D2 = d2(F, K, t, sigma);
  const firstTerm = -S * normPdf(D1) * sigma / (2 * Math.sqrt(t));

  if (flag === "c") {
    const secondTerm = r * K * Math.exp(-r * t) * normCdf(D2);
    return (firstTerm - secondTerm) / 365;
  }

  const secondTerm = r * K * Math.exp(-r * t) * normCdf(-D2);
  return (firstTerm + secondTerm) / 365;
}

export function blackScholesRho(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number): number {
  const F = S * Math.exp(r * t);
  const D2 = d2(F, K, t, sigma);
  const discount = Math.exp(-r * t);
  return flag === "c" ? t * K * discount * normCdf(D2) * 0.01 : -t * K * discount * normCdf(-D2) * 0.01;
}

export function blackScholesMertonDelta(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number, q: number): number {
  const F = S * Math.exp((r - q) * t);
  const D1 = d1(F, K, t, sigma);
  return flag === "p" ? -Math.exp(-q * t) * normCdf(-D1) : Math.exp(-q * t) * normCdf(D1);
}

export function blackScholesMertonGamma(S: number, K: number, t: number, r: number, sigma: number, q: number): number {
  const F = S * Math.exp((r - q) * t);
  return Math.exp(-q * t) * normPdf(d1(F, K, t, sigma)) / (S * sigma * Math.sqrt(t));
}

export function blackScholesMertonVega(S: number, K: number, t: number, r: number, sigma: number, q: number): number {
  const F = S * Math.exp((r - q) * t);
  return S * Math.exp(-q * t) * normPdf(d1(F, K, t, sigma)) * Math.sqrt(t) * 0.01;
}

export function blackScholesMertonTheta(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number, q: number): number {
  const F = S * Math.exp((r - q) * t);
  const D1 = d1(F, K, t, sigma);
  const D2 = d2(F, K, t, sigma);
  const firstTerm = S * Math.exp(-q * t) * normPdf(D1) * sigma / (2 * Math.sqrt(t));

  if (flag === "c") {
    const secondTerm = -q * S * Math.exp(-q * t) * normCdf(D1);
    const thirdTerm = r * K * Math.exp(-r * t) * normCdf(D2);
    return -(firstTerm + secondTerm + thirdTerm) / 365;
  }

  const secondTerm = -q * S * Math.exp(-q * t) * normCdf(-D1);
  const thirdTerm = r * K * Math.exp(-r * t) * normCdf(-D2);
  return (-firstTerm + secondTerm + thirdTerm) / 365;
}

export function blackScholesMertonRho(flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number, q: number): number {
  const F = S * Math.exp((r - q) * t);
  const D2 = d2(F, K, t, sigma);
  const discount = Math.exp(-r * t);
  return flag === "c" ? t * K * discount * normCdf(D2) * 0.01 : -t * K * discount * normCdf(-D2) * 0.01;
}

export function numericalDelta(model: "black" | "black-scholes" | "black-scholes-merton", flag: OptionFlag, S: number, K: number, t: number, r: number, sigma: number, q = 0): number {
  const dS = 0.01;
  assertPositiveStrike(K);
  if (S === 0) {
    return flag === "c" ? 0 : -1;
  }
  const price = (spot: number): number => {
    if (model === "black") return black(flag, spot, K, t, r, sigma);
    if (model === "black-scholes") return blackScholes(flag, spot, K, t, r, sigma);
    return blackScholesMerton(flag, spot, K, t, r, sigma, q);
  };
  return (price(S * (1 + dS)) - price(S * (1 - dS))) / (2 * S * dS);
}

export { d1, d2 };
