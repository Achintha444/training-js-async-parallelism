# training-js-async-parallelism

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🍁 Overview

How to deal with a **large** amount of **asynchronous operations** in a **controlled** way.

The typical use case is when you have a variable number of requests to send to a server but you want to avoid stressing the server or to be blocked by a rate limiter.

## 🖥️ How to demo

* Clone and `npm install`
* Use `npm test` to start `vitest`.

This repository was created using [TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html), each commits represents one step in the process :

### [`dd59abd`](https://github.com/ArnaudBuchholz/training-js-async-parallelism/commit/dd59abddb2b12bb911cb6dfe6894e00fdb3b464e) initial commit

Uses [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) to execute all operations regardless of the queue size. As a consequence, the larger the queue, the more operations are executed.

### [`577820b`](https://github.com/ArnaudBuchholz/training-js-async-parallelism/commit/577820b58aa5cb1621412b5b0f308dfb4ac080a2) assess parallel execution count

Demonstrates how to verify the count of parallel execution. This is required for the next steps.

### [`3d2cf49`](https://github.com/ArnaudBuchholz/training-js-async-parallelism/commit/3d2cf49dfdbdfae4baae5491bde4ea430c1d3565) 'sequential' execution

Re-implementation of `Promise.allSettled` using a loop to iterate over the queue. As a result, execution is done sequentially.

### [`1fef0be`](https://github.com/ArnaudBuchholz/training-js-async-parallelism/commit/1fef0be20eb00339090a781005579847cfc88334) batch parallel execution

Introduces the `parallel` parameter to control how many parallel operations are allowed. The tests are checking that the parameter is respected.
