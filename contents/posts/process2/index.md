---
title: "[운영체제(OS)] 2.프로세스-IPC"
description: "IPC에 대해서"
date: 2022-02-24
update: 2022-02-24
tags:
  - 운영체제
---

## IPC란

<p align="center">
    <img src="process.png">
</p>

프로세스는 독립적으로 실행되거나 서로 협력하면서 실행될 수 있다. 독립적이란 말은 다른 프로세스들과 데이터를 공유하지 않는다는 것이고 반대로 협력적이라는 것은 다른 프로세스들과 데이터를 공유한다는 것이고 다른 프로세스에 영향을 주거나 받을 수 있다. 이때 프로세스들의 통신을 IPC(inter process communication)이라고 한다.

## IPC의 통신 방법

특정 프로세스A에서 생산하면(produce) 특정 프로세스B에서 소비하는(consumer) 프로세스의 구조에서 데이터 통신 방법은 두가지가 있다

1. 공유 메모리(Shared Memory)
2. 메세지 전달(Message Passing)

각각의 통신 방법에 대해 알아보자.

## 공유 메모리(shared memory)

<p align="center">
    <img src="shared.png">
</p>

공유 메모리는 프로세스간 특정 메모리 영역을 공유해서 사용할 수 있도록 한다. 프로세스가 공유 메모리 할당을 커널에 요청하면 커널은 해당 프로세스에 메모리 공간을 할당해준다.\
이 공유 메모리에 생산자는 buffer를 채우고 소비자는 buffer를 비운다.

공유 메모리 방식은 다른 방식에 비해 속도가 빠르지만 메모리에 접근하고 데이터를 다루는 것을 모두 프로그래머가 명시적으로 코드를 작성해줘야하는 불편함이 있었다.

## 메세지 전달(message passing)

<p align="center">
    <img src="message.png">
</p>

메세지 전달 방식은 프로세스간 데이터 통신 수단을 O/S에서 제공해주는 것을 말한다. 생상자는 전송 메소드 send(), 소비자는 응답 메소드 receive()를 사용하고 커널에서 내부 buffer를 관리한다.\
메세지 전달 방식은 일반적인 경우 공유 메모리 방식 보다 속도는 느리지만 커널이 기본적인 기능을 제공하므로 공유 메모리 방식보다 구현이 쉬운 점이 있다.

프로세스간 message passing을 위해서 communication links가 만들어지는데 이 links의 구현은 다음과 같은 방식이 있다.

- direct or indirect
- synchronous or asynchronous
- automic or explicit buffering

### direct

프로세스끼리 통신을 하기 위해선 서로를 칭하는 명시적인 이름이 있어야 한다. 이를 다음과 같이 가정할 수 있다.

- sender : message를 보내는 process, send( process_B, message )
- recipient : message를 받는 process, receive( process_A, message )

이렇게되면 프로세스A와 프로세스B 사이에 link가 하나만 생기게 되고 이렇게 프로세스끼리 직접 link되어 communication 하는 것을 direct communication이라고 한다.

위의 상황같이 발신자와 수신자 둘 다 서로의 이름을 표기하면 **symmentry**라고 하고, 발신자만 이름을 표기하고 수신자는 아무것도 표기하지 않는 것을 **asymmentry**라고 한다. 아래와 같은 경우이다.

`send (process_A, message) -----> receive (message) `

direct communication 방식은 두 프로세스간에만 데이터를 주고 받을 수 있고, 명시적이기 때문에 하드코딩 되어있다는 단점이 있다.

### indirect

프로세스끼리 직접 communication 하는 것이 아니라 mailbox or port를 통해 message를 주고 받는 것을 indirect communication 이라고 한다.\
mailbox는 고유의 id가 있는데 다음과 같이 나타낼 수 있다.

- send(A, message) - mailbox A에게 message를 전달
- receive(A, message) - mailbox A에게 message를 받음

### synchronous or asynchronous

blocking과 non-blocking 이라고도 하며 동기적으로 구현하는 방식과 비동기적으로 구현하는 방식의 차이가 있다.

| Blocking send       | 수신자 프로세스나 mailbox가 메세지를 받을 때 까지 메세지를 보낼 수 없음 |
| ------------------- | ----------------------------------------------------------------------- |
| Nonblocking send    | 발신자 프로세스가 메일을 보내고 다시 자기 일을 함                       |
| Blocking receive    | 메세지가 이용될 수 있을 때까지 아무것도 할 수 없음                      |
| Nonblocking receive | 수신자 메세지가 valid한 메세지 혹은 null을 복구함                       |
