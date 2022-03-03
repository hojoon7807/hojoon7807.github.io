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
대표적으로 Atomic Type, volatile, synchronized가 있다.\

이 중 **Atomic** 타입을 사용하면 멀티 쓰레드 환경에서 원자성을 보장하는 변수를 선언할 수 있다.
