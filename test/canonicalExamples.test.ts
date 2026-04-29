import assert from "node:assert/strict";
import test from "node:test";
import {
  black,
  blackDelta,
  blackGamma,
  blackScholes,
  blackScholesDelta,
  blackScholesImpliedVolatility,
  blackScholesMerton,
  blackScholesMertonDelta,
  blackScholesMertonImpliedVolatility,
  blackVega,
  d1,
  d2,
  impliedVolatilityOfDiscountedOptionPrice,
  impliedVolatilityOfUndiscountedOptionPrice,
  normalisedBlack,
  normalisedImpliedVolatility,
  undiscountedBlack
} from "../src/index.js";

function close(actual: number, expected: number, tolerance: number): void {
  assert.ok(
    Math.abs(actual - expected) <= tolerance || Math.abs(actual - expected) <= tolerance * Math.abs(expected),
    `${actual} != ${expected}`
  );
}

test("canonical Black doctest examples from py_vollib", () => {
  close(black("c", 100, 100, 0.5, 0.02, 0.2), 5.5811067246048118, 1e-12);
  close(undiscountedBlack(100, 100, 0.2, 0.5, "c"), 5.637197779701664, 1e-12);

  const x = Math.log(100 / 95);
  const s = 0.3 * Math.sqrt(0.5);
  const normalisedIntrinsicCall = Math.max(100 - 95, 0) / Math.sqrt(100 * 95);
  const put = normalisedBlack(x, s, "p");
  const call = normalisedBlack(x, s, "c");

  close(put, 0.061296663817558904, 1e-12);
  close(call, 0.11259558142181655, 1e-12);
  close(put, call - normalisedIntrinsicCall, 1e-12);
});

test("canonical Black implied volatility doctest examples from py_vollib", () => {
  const discountedCall = black("c", 100, 100, 0.5, 0.02, 0.2);
  close(discountedCall, 5.5811067246, 1e-5);
  close(impliedVolatilityOfDiscountedOptionPrice(discountedCall, 100, 100, 0.02, 0.5, "c"), 0.2, 1e-5);

  const undiscountedCall = undiscountedBlack(100, 100, 0.2, 0.5, "c");
  close(undiscountedCall, 5.6371977797, 1e-5);
  close(impliedVolatilityOfUndiscountedOptionPrice(undiscountedCall, 100, 100, 0.5, "c"), 0.2, 1e-5);

  const betaCall = normalisedBlack(0.0, 0.2, "c");
  const betaPut = normalisedBlack(0.1, 0.23232323888, "p");
  close(betaCall, 0.0796556745541, 1e-5);
  close(normalisedImpliedVolatility(betaCall, 0.0, "c"), 0.2, 1e-5);
  close(betaPut, 0.0509710222785, 1e-5);
  close(normalisedImpliedVolatility(betaPut, 0.1, "p"), 0.23232323888, 1e-5);
});

test("canonical Black-Scholes doctest examples from py_vollib and Hull", () => {
  close(blackScholes("c", 100, 90, 0.5, 0.01, 0.2), 12.111581435, 1e-6);
  close(blackScholes("p", 100, 90, 0.5, 0.01, 0.2), 1.66270456231, 1e-6);

  const price = blackScholes("c", 100, 100, 0.5, 0.01, 0.2);
  close(price, 5.87602423383, 1e-5);
  close(blackScholesImpliedVolatility(price, 100, 100, 0.5, 0.01, "c"), 0.2, 1e-5);

  const forward = 42 * Math.exp(0.1 * 0.5);
  close(d1(forward, 40, 0.5, 0.2), 0.7693, 1e-4);
  close(d2(forward, 40, 0.5, 0.2), 0.6278, 1e-4);
});

test("canonical Black-Scholes-Merton doctest examples from py_vollib and Haug", () => {
  close(blackScholesMerton("p", 100, 95, 0.5, 0.1, 0.2, 0.05), 2.4648, 1e-4);

  const price = blackScholesMerton("c", 100, 100, 0.5, 0.01, 0.2, 0);
  close(price, 5.87602423383, 1e-5);
  close(blackScholesMertonImpliedVolatility(price, 100, 100, 0.5, 0.01, 0, "c"), 0.2, 1e-5);
});

test("canonical Greek doctest examples currently exposed by vollib-ts", () => {
  const S = 49;
  const K = 50;
  const r = 0.05;
  const t = 0.3846;
  const sigma = 0.2;

  close(blackScholesDelta("c", S, K, t, r, sigma), 0.522, 0.01);
  close(blackScholesMertonDelta("c", S, K, t, r, sigma, 0), 0.522, 0.01);

  close(blackDelta("c", S, K, t, r, sigma), 0.45107017482201828, 1e-6);
  close(blackGamma(S, K, t, r, sigma), 0.0640646705882, 1e-6);
  close(blackVega(S, K, t, r, sigma), 0.118317785624, 1e-6);
});
