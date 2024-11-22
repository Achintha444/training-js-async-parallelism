# training-js-async-parallelism

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 💝 Thanks

This repository was created using an algorithm developed by [Arnaud Buchholz](https://github.com/ArnaudBuchholz), you can find more information about it in the [training-js-async-parallelism](https://github.com/ArnaudBuchholz/training-js-async-parallelism) repository.

## 🍁🦁 Overview

How to deal with a **large** amount of **asynchronous operations** in a **controlled** way.

The typical use case is when you have a variable number of requests to send to a server but you want to avoid stressing the server or to be blocked by a rate limiter.

## 🔁 What is different from the original algorithm 

In the original algorithm, [Arnaud Buchholz](https://github.com/ArnaudBuchholz) uses only the main thread to execute the operations, using parallel executions. 

But in this repository, I used the **workers** to execute the operations, which allows to use multiple threads and to execute the operations in parallel, while using the same principal of the parallel executions for the main thread.

## 🧪 Results of the benchmark test (index.spec.ts)

![Results of the benchmark](https://github.com/Achintha444/training-js-async-parallelism/blob/main/readme-images/image.png)

From this test you can see that the when we increase the number of workers the execution time decreases, which means that the algorithm is scalable and can handle a large amount of operations in a controlled way.

## 🔴 Challenges

- Using workers is CPU intensive, so it's important to use a good number of workers to avoid overloading the CPU.
- Not all use cases can be handled by workers, for example if you have a lot of I/O operations, it's better to use a single thread.

## 🖥️ How to demo

* Clone and `npm install`
* Use `npm test` to start `vitest`.

This repository was created using [TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html).

## 🤝 Contributing

This algorithm is not perfect, so if you have any suggestions or improvements, please feel free to contribute.
