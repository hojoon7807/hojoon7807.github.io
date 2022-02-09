---
title: "기본 타입(primitive type)"
description: "기본 자료형에 대해서"
date: 2022-02-09
update: 2022-02-09
tags:
  - java
---

# 기본 자료형

데이터 타입은 데이터가 메모리에 어떻게 저장되고, 프로그램에서 어떻게 처리되어야 하는지를 명시적으로 알려주는 역할을 한다. 자바에서는 여려 형태의 타입을 미리 정의하여 제공하는데 이것을 기본 타입이라고 한다. 자바에는 8종류의 기본 타입이 제공되며, 크게 정수형, 실수형, 문자형, 논리형 타입으로 나눌 수 있다.

---

## 정수형 타입

자바의 기본 타입 중 정수를 나타내는 타입은 다음이 있다.

1. byte
2. short
3. int
4. long

각각의 정수형 타입에 따른 메모리의 크기 및 데이터의 표현 범위는 다음과 같다.

<!--
|제목|내용|설명|
|------|---|---|
|테스트1|테스트2|테스트3|
|테스트1|테스트2|테스트3|
|테스트1|테스트2|테스트3|
-->

<table>
    <tr>
        <th>타입</th>
        <th>메모리 크기</th>
        <th>표현 범위</th>
    </tr>
    <tr>
        <td>byte</td>
        <td>1 byte</td>
        <td>-128~127</td>
    </tr>
    <tr>
        <td>short</td>
        <td>2 byte</td>
        <td>-2<sup>15</sup>~2<sup>15</sup>-1</td>
    </tr>
    <tr>
        <td>int</td>
        <td>4 byte</td>
         <td>-2<sup>31</sup>~2<sup>31</sup>-1</td>
    </tr>
    <tr>
        <td>long</td>
        <td>8 byte</td>
         <td>-2<sup>63</sup>~2<sup>63</sup>-1</td>
    </tr>
    <tr>
        <td>char</td>
        <td>2 byte</td>
         <td>0~2<sup>16</sup>-1</td>
    </tr>
</table>

char는 부호(unsigned)가 없기 때문에 같은 2바이트의 메모리를 같고 있어도 표현 범위가 많다.

그러면 나이 값(age)을 할당한다 했을 때 어떤 자료형을 사용해야 될까?? byte??

> 과거의 16비트 컴퓨터 생각하면 메모리가 640kbyte였다. 그래서 메모리의 관리에 신경을 써야되기 때문에 어떤 자료형을 선택해야하는지가 중요했지만, 하드웨어의 발달로 인한 메모리 공간의 증가로 크게 신경쓰지 않고 자바 정수형의 기본형인 int형을 사용하면 된다고한다.

### 오버플로우와 언더플로우

오버플로우란 해당 타입이 표현할 수 있는 최대범위보다 큰수를 저장할 때 발생하는 현상을 가리킨다.
반대로 언더플로우는 해당 타입이 표현할 수 있는 최소 범위보다 작은 수를 저장할 때 발생하는 현상을 가리킨다.

다음 예제를 보면 결과에 어떤 영향을 주는지 알 수 있다.

```java
public class Primitive {
    public static void main(String[] args) {
        byte num1 = 127;
        byte num2 = -128;

        num1++;
        num2--;

        System.out.println(num1);
        System.out.println(num2);
    }
}
```

실행 결과
![](result.png)

byte타입의 표현 범위는 -128~127 이다. 위의 예제는 num1에 1을 더하고 num2에 1을 빼려고 한다. 그 결과 오버플로우와 언더플로우가 발생해 예상하지 못한 결과가 나오게된다.

저런 결과가 나오는 이유는 뭘까??

num1와 num2를 비트로 표현하면 다음과 같이 표현할 수 있다.

<table>
    <tr>
        <th>num1</th>
        <th>8</th>
        <th>7</th>
        <th>6</th>
        <th>5</th>
        <th>4</th>
        <th>3</th>
        <th>2</th>
        <th>1</th>
    </tr>
    <tr>
        <td>2진수</td>
        <td></td>
        <td>2<sup>6</sup></td>
        <td>2<sup>5</sup></td>
        <td>2<sup>4</sup></td>
        <td>2<sup>3</sup></td>
        <td>2<sup>2</sup></td>
        <td>2<sup>1</sup></td>
        <td>2<sup>0</sup></td>
    </tr>
        <tr>
        <td>값</td>
        <td>0</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
    </tr>
</table>

<table>
    <tr>
        <th>num2</th>
        <th>8</th>
        <th>7</th>
        <th>6</th>
        <th>5</th>
        <th>4</th>
        <th>3</th>
        <th>2</th>
        <th>1</th>
    </tr>
    <tr>
        <td>2진수</td>
        <td></td>
        <td>2<sup>6</sup></td>
        <td>2<sup>5</sup></td>
        <td>2<sup>4</sup></td>
        <td>2<sup>3</sup></td>
        <td>2<sup>2</sup></td>
        <td>2<sup>1</sup></td>
        <td>2<sup>0</sup></td>
    </tr>
        <tr>
        <td>값</td>
        <td>1</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
    </tr>
</table>

num1와 num2에 각각 1을 더하고 빼면 다음과 같은 결과가 된다.

<table>
    <tr>
        <th>num1</th>
        <th>8</th>
        <th>7</th>
        <th>6</th>
        <th>5</th>
        <th>4</th>
        <th>3</th>
        <th>2</th>
        <th>1</th>
    </tr>
    <tr>
        <td>2진수</td>
        <td></td>
        <td>2<sup>6</sup></td>
        <td>2<sup>5</sup></td>
        <td>2<sup>4</sup></td>
        <td>2<sup>3</sup></td>
        <td>2<sup>2</sup></td>
        <td>2<sup>1</sup></td>
        <td>2<sup>0</sup></td>
    </tr>
        <tr>
        <td>값</td>
        <td>1</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
        <td>0</td>
    </tr>
</table>

<table>
    <tr>
        <th>num2</th>
        <th>8</th>
        <th>7</th>
        <th>6</th>
        <th>5</th>
        <th>4</th>
        <th>3</th>
        <th>2</th>
        <th>1</th>
    </tr>
    <tr>
        <td>2진수</td>
        <td></td>
        <td>2<sup>6</sup></td>
        <td>2<sup>5</sup></td>
        <td>2<sup>4</sup></td>
        <td>2<sup>3</sup></td>
        <td>2<sup>2</sup></td>
        <td>2<sup>1</sup></td>
        <td>2<sup>0</sup></td>
    </tr>
        <tr>
        <td>값</td>
        <td>0</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
    </tr>
</table>

이렇게 오버플로우와 언더플로우가 어떻게 발생하는지 알아봤다.
