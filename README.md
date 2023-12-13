## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migration

```bash
# generate migration
npm run m:g

# migrate
npm run m:r

# rollback
npm run m:re

```

## Test

Create database for test database_name_test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Structure

>

    |-- src
        |-- auth
        |-- config
        |-- decorators
        |-- entities
        |-- enums
        |-- loggers
        |-- modules
        |-- repositories
    |-- test
        |-- seeds
    |-- app.module.ts
    |-- main.ts

## Coverage

| File                      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| ------------------------- | ------- | -------- | ------- | ------- | ----------------- |
All files                   |     100 |      100 |     100 |     100 | 
 auth                       |     100 |      100 |     100 |     100 | 
  auth.controller.ts        |     100 |      100 |     100 |     100 | 
  auth.service.ts           |     100 |      100 |     100 |     100 | 
 auth/dto                   |     100 |      100 |     100 |     100 | 
  auth.dto.ts               |     100 |      100 |     100 |     100 | 
 auth/guard                 |     100 |      100 |     100 |     100 | 
  auth.guard.ts             |     100 |      100 |     100 |     100 | 
  roles.guard.ts            |     100 |      100 |     100 |     100 | 
 decorators                 |     100 |      100 |     100 |     100 | 
  public.decorator.ts       |     100 |      100 |     100 |     100 | 
  roles.decorator.ts        |     100 |      100 |     100 |     100 | 
 entities/subscribers       |     100 |      100 |     100 |     100 | 
  user.subscriber.ts        |     100 |      100 |     100 |     100 | 
 modules/application        |     100 |      100 |     100 |     100 | 
  application.controller.ts |     100 |      100 |     100 |     100 | 
  application.service.ts    |     100 |      100 |     100 |     100 | 
 modules/application/dto    |     100 |      100 |     100 |     100 | 
  application.dto.ts        |     100 |      100 |     100 |     100 | 
 modules/user               |     100 |      100 |     100 |     100 | 
  user.service.ts           |     100 |      100 |     100 |     100 | 

Test Suites: 7 passed, 7 total
Tests:       55 passed, 55 total
Snapshots:   0 total
Time:        8.389 s
Ran all test suites.  