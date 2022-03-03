---
title: "Java - Atomic"
description: "Atomic에 대해서"
date: 2022-03-02
update: 2022-03-02
tags:
  - java
---

## Atomic

자바의 concurrency API에서 제공하는 Atomic Type에 대해 알아보겠다.\
멀티 쓰레딩 프로그래밍에서는 기본적으로 동시성 문제를 고려해야되는데, 이러한 문제들을 해결하기 위해 자바에서는 다양한 방법을 제공한다.\
대표적으로 Atomic Type, volatile, synchronized가 있다.

Atomic Type을 설명하기전에 원자성의 개념을 알아보자.

Atomic은 한글로 원자라는 의미를 가지고 있고, 원자는 더 쪼갤 수 없는 작은 단위를 의미한다.
Oracle 자바 레퍼선스에서는 Atomic Access를 다음과 같이 정의하고 있다.

> In programming, an atomic action is one that effectively happens all at once.\
> An atomic action cannot stop in the middle: it either happens completely, or it doesn't happen at all.

원자적 행위란 사실상 여러가지가 한번에 일어나는 것을 말하는데, 이는 중간에 중지될 수 없고 실행되면 끝까지 실행되던가 아니면 아예 실행되지 않아야 한다고 말한다. 예시를 들어 설명하면 쇼핑몰에서 물건을 주문하는 경우를 말할 수 있다.

결제와 상품 수량 변경은 서로 다른 작업이지만 한 세트로 진행이 되어야 한다. 어떤 상품의 재고가 1개 밖에 없는데 해당 상품을 사려는 고객이 2명이 존재하는 상황을 가정하고 아래와 같은 순서로 요청이 들어오면 어떻게 되는지 살펴보자.

1. 1번 회원의 결제가 성공한다.
2. 상품 수량의 업데이트가 끝나기전에 2번 회원의 결제도 성공한다.
3. 상품 수량 업데이트
4. 상품 수량 업데이트 - 3번의 작업으로 재고는 이미 0이 되었지만 2번 회원은 이미 돈을 지불했는데 재고가 0인 상태다.

현실에서는 이와 같이 많은 사람들이 동시에 동일한 제품을 구매하려는 상황이 부지기수다.\
작업이 정상적으로 처리되려면 1번 회원의 결제 결과가 재고에 반영되기 전에 2번 회원의 결제를 잠시 막아둬야하고, 다시 2번 회원의 결제가 시작될 때 재고를 확인하고 재고가 0이라면 결제를 막아야 한다. 비슷한 예시로 수강신청이 있다.

하나의 쓰레드가 모든 작업을 순차적으로 처리하면 이러한 걱정이 없겠지만 사용자는 많은 대기시간을 가지게될 것이다. 그래서 멀티 쓰레드가 사용된다.\
이처럼 작업 단위가 분리되면 안되는 연산에 Atomic operation이 필요하고 Java에서 지원해주는 Atomic operation이 Atomic Type, volatile, synchronized 이다.

## Atomic Type

**Atomic Type**을 사용하면 멀티 쓰레드 환경에서 원자성을 보장하는 변수를 선언할 수 있다.\
