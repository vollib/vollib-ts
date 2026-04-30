# vollib-ts

TypeScript option pricing, implied volatility, and Greeks built on
LetsBeRational.

## Installation

```sh
npm install @vollib/vollib
```

## Input domain

Strike prices (`K`) must be strictly positive for Black, Black-Scholes, and
Black-Scholes-Merton calculations. Handle limiting cases such as a zero-strike
call in application code before calling `vollib`.

## Scripts

```sh
npm install
npm test
```
