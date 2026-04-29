import assert from "node:assert/strict";
import test from "node:test";
import {
  black,
  blackScholes,
  blackScholesDelta,
  blackScholesMerton,
  impliedVolatilityOfDiscountedOptionPrice,
  normalisedBlack,
  normalisedImpliedVolatility
} from "../src/index.js";

function close(actual: number, expected: number, tolerance = 1e-9): void {
  assert.ok(Math.abs(actual - expected) <= tolerance || Math.abs(actual - expected) <= tolerance * Math.abs(expected), `${actual} != ${expected}`);
}

test("Black model wrappers match Python doctest values", () => {
  close(black("c", 100, 100, 0.5, 0.02, 0.2), 5.5811067246048118, 1e-12);
  close(normalisedBlack(Math.log(100 / 95), 0.3 * Math.sqrt(0.5), "p"), 0.061296663817558904, 1e-12);
  const price = black("c", 100, 100, 0.5, 0.02, 0.2);
  close(impliedVolatilityOfDiscountedOptionPrice(price, 100, 100, 0.02, 0.5, "c"), 0.2, 1e-12);
  close(normalisedImpliedVolatility(normalisedBlack(0, 0.2, "c"), 0, "c"), 0.2, 1e-12);
});

test("Black-Scholes and Black-Scholes-Merton wrappers match published examples", () => {
  close(blackScholes("c", 100, 90, 0.5, 0.01, 0.2), 12.111581435, 1e-9);
  close(blackScholes("p", 100, 90, 0.5, 0.01, 0.2), 1.66270456231, 1e-9);
  close(blackScholesMerton("p", 100, 95, 0.5, 0.1, 0.2, 0.05), 2.46478764676, 1e-9);
});

test("analytical delta sample is stable", () => {
  close(blackScholesDelta("c", 49, 50, 0.3846, 0.05, 0.2), 0.521601633972, 1e-9);
});
