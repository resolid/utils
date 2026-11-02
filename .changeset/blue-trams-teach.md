---
"@resolid/utils": major
---

feat(function)!: rework function utilities and split by feature

- add `once` and rename `runIf` to `resolveValue`
- make `withTimeout` accept a task function so a timeout can abort the task
- rework `debounce`/`throttle` around `edges`, `signal`, `flush` and `schedule`
- avoid unhandled rejection when `abortable` receives an already aborted signal

BREAKING CHANGE: `withTimeout` now takes `(signal) => Promise<T>` instead of
a `Promise<T>`. `runIf` is renamed to `resolveValue`, `ValueOrFunction` now
takes `<A, R>`, and `debounce`/`throttle` replace the `start`/`middle`/`once`
options with `edges` and `signal`.
