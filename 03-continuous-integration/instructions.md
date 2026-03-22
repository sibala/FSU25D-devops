# Instructions

## We will cover
- CI setup with Github Actions [getting-started-ci-cd.md](getting-started-ci-cd.md)
- CD setup with Vercel [getting-started-ci-cd.md](getting-started-ci-cd.md)
- Solution for [04-api-tests-solutions-with-CI/CD](04-api-tests-solutions-with-CI/CD)
- How to recognize what to test in unit, integration, e2e
    - Install package `npm i -D @vitest/coverage-v8`
    - Add the flag `--coverage` in the "test"-script, in package.json, Like så `"test": "vitest run --coverage && npm run test:e2e"`
    - When running the tests `npm test`, we get now a report on how much coverage are done by vitest (unit & integration)
- Solution for [05-todo-e2e-solutions](05-todo-e2e-solutions)
- Present kunskapskontroll 1


## Reading
- [Github Actions - Quick Start](https://docs.github.com/en/actions/get-started/quickstart)
- [Vercel](https://vercel.com/)
- [Vitest — Coverage](https://vitest.dev/guide/coverage.html)

<br /> 

- [Vitest — Getting Started](https://vitest.dev/guide/)
- [Vitest — API Reference](https://vitest.dev/api/)
- [Vitest — expect](https://vitest.dev/api/expect.html)
- [Vitest — Mocking](https://vitest.dev/guide/mocking.html)
- [Vitest — Test Environment (jsdom)](https://vitest.dev/guide/environment.html)
- [Playwright — Getting Started](https://playwright.dev/docs/intro)
- [Playwright — Locators](https://playwright.dev/docs/locators)
- [Playwright — Assertions](https://playwright.dev/docs/test-assertions)
- [Playwright — Web Server](https://playwright.dev/docs/test-webserver)
- [ESLint — Getting Started](https://eslint.org/docs/latest/use/getting-started)
- [DummyJSON — Posts API](https://dummyjson.com/docs/posts)
- [MDN — ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN — async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
