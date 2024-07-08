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
## 1. 개발 환경
- Back-end : nest.js
- 버전 및 이슈 관리 : Github, Github Issues, Github Project
- 협업 툴 : Notion


## 2. 채택한 개발 기술
### eslint, prettier
- 정해진 규칙에 따라 자동적으로 코드 스타일을 정리해 코드의 일관성을 유지하고자 했습니다.
- 코드 품질 관리는 eslint에, 코드 포맷팅은 prettier에 일임해 사용했습니다.


## 3. 프로젝트 구조
├── README.md
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── nest-cli.json
├── package-lock.json
├── package.json
├── tsconfig.build.json
├── tsconfig.json
│
├── test
│    └── app.e2e-spec.ts
│    └── jest-e2e.json
└── src
     ├── app.controller.ts
     ├── app.module.ts
     ├── app.service.ts
     ├── main.ts
     ├── auth
     │     ├── auth.controller.ts
     │     ├── auth.module.ts
     │     ├── auth.service.ts
     │     ├── auth.middleware.ts
     │     └── jwt.strategy.ts
     │          
     ├── level
     │     └── level.guard.ts
     ├── user
     │     ├── decoraters
     │     │     ├── user.decorator.ts
     │     │     └── userInfo.decorator.ts
     │     ├── dto
     │     │     ├── create-user.dto.ts
     │     │     └── login-user.dto.ts
     │     ├── entities
     │     │     └── user.entity.ts
     │     ├── user.controller.ts
     │     ├── user.module.ts
     │     ├── user.service.ts
     │     └── userType.enum.ts
     |
     ├── performance
     │     ├── dto
     │     │     ├── create-performance.dto.ts
     │     │     └── update-performance.dto.ts
     │     ├── entities
     │     │     ├── performance.entity.ts
     │     │     └── performanceTime.entity.ts
     │     ├── performance.controller.ts
     │     ├── performance.module.ts
     │     └── performance.service.ts
     |
     |
     ├── seat
     │     ├── dto
     │     │     ├── create-seat.dto.ts
     │     │     └── update-seat.dto.ts
     │     ├── entities
     │     │     └── seat.entity.ts
     │     ├── seat.controller.ts
     │     ├── seat.module.ts
     │     └── seat.service.ts
     |
     |
     └── reservation
          ├── dto
          │     └── reservation-online.dto.ts
          ├── entities
          │     └── reservation.entity.ts
          ├── reservation.controller.ts
          ├── reservation.module.ts
          ├── paymentStatus.enum.ts
          └── reservation.service.ts
     
## 4. 개발 기간
### 2024-07-02 ~ 2024-07-07

## 5. 설명
### 1 인증 및 사용자
- 인증 : auth, 사용자 : user
- 회원가입 / 로그인은 auth에서 구현되며, AccessToken은 로그인 기능으로부터 만들어진다.
- 사용자 정보 확인은 user
  
### 2 공연
- 공연 : performance
- 공연 시간 : performanceTime
- 공연 좌석 : seat
- 공연을 생성하게 되면 -> 공연시간, 공연 좌석 모델에 맞게 데이터가 생성된다.
- ( 즉, 공연 데이터, 공연시간, 공연 좌석 데이터가 동시에 만들어짐 -> 트랜잭션 이용 )
- 공연 데이터 안에는 공연시간, 공연 좌석 데이터를 입력받게 되있으며,
- 공연 시간을 입력받으면 공연 시간의 수만큼 공연시간 데이터가 만들어지며
- 공연 좌석을 입력받으면 공연 시간마다 공연 좌석의 수만큼 데이터가 만들어진다.

### 3 예약
- 좌석을 지정하지 않고 예매
- 예외성 처리
  공연 , 공연시간 id로 조회했는데 나오지 않을 시
  

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
2. 개인프로젝트때 readme를 제대로 작성해본적이 처음이라, 잘 작성한지 모르겠다.
  

