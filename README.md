<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->




## Installation

```bash
$ npm install
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## 설명
### 1
### 2

## 트러블슈팅
### 유효성검증은 DTO? Entity?
- 유효성검증은 어떤 파일에서 하는게 더 효율적일까?
- 예전에 튜터님께서 여러번 방어하면 좋다고 말씀하신게 기억난다.
- 그렇다는 말은 두 파일 다 유효성 검증을 해야 보안에 좋은걸까?

### auth와 user를 나누는 것
- auth와 user를 제대로 나눈건지 모르겠다.
- user에는 기능이 그렇게 많지 않은데, 이런 경우 auth와 user가 합쳐도 되지 않을까라는 생각을 했다.

### performance와 performanceTimes 나누는것
- 엔티티는 나눴는데 모듈을 나누기에는 performanceTime에 대한 기능이 별로 없어서
- performnace 파일에 performanceTime에 대한 기능도 같이 넣었다.
- 앞서 말한 auth/user에 대한 얘기와 비슷하다. 이럴때는 어떻게 해야 할까

### 에러 : Cannot delete or update a parent row: a foreign key constraint fails 
- 부모 테이블의 행을 삭제하려고 할때 자식 테이블에서 해당 행을 참조하고 있어 삭제가 불가능하다는 것이다.
- 해결방법 : 자식 테이블에 아래 코드 추가
```ts
{ onDelete: 'CASCADE' }
```

### req.user를 했을때에 User데이터가 나오지 않은 이유
- @UseGuards 활용을 하지 않아서 에러

### 유저 정보를 불러올때
- req.user / userRepository 둘 중 어느 방법을 사용해야 더 효율적인걸까?

## 🙋‍♀️ 소감
1. return값에 대해 status, message 값을 제대로 부여하지 못해 아쉽다.
  

