---
title: "Java - 람다와 함수형 인터페이스"
description: "람다와 함수형 인터페이스에 대해서"
date: 2022-03-11
update: 2022-03-11
tags:
  - java
---

## 람다와 함수형 인터페이스

Java에 람다 표현식이 추가됨으로써 함수형 인터페이스, 메서드 참소가 등장할 수 있었습니다. 이를 바탕으로 stream API가 탄생했고, 컬렉션 기반의 기술을 편리하고 빠르게 처리할 수 있게 되었습니다. 이번 포스팅에서는 람다와 함수형 인터페이스에 대해 알아보겠습니다.

## 람다 표현식이 필요한 이유

자바 기반의 프로그램은 계속해서 비대해지고 있습니다. 유연성과 다양성을 확보하기 위해 인터페이스 기반으로 개발을 많이하는데, 이 때문에 별도로 구현된 클래스를 만들기도하고 간단한 코드의 경우 중첩 클래스나 익명 클래스 형태로 내용을 구현하게 됩니다. 하지만 익명 클래스를 많이 만들면 비즈니스 로직의 구현보다 그것을 담기 위한 코드를 많이 작성하게 되고 중복되는 코드가 많아지는 문제가 생깁니다.

이러한 반복적이고 비효율적인 구조를 개선하고자 익명 클래스를 단순화하여 그 표현식을 메서드의 인수로 전달하거나 인터페이스의 객체를 생성할 수 있는 기능을 제공하는 람다 표현식이 생기게되었습니다.

먼저 간단한 예제를 통해 람다 표현식의 모습을 알아보겠습니다.

```java
public class BaseballPlayer {
    private String teamName;
    private String playerName;

    ...

    public static void main(String[] args){
        List<BaseballPlayer> list = new ArrayList();

        list.sort(new Comparator<BaseballPlayer>(){
            @Override
            public int compare(BaseballPlayer object1, BaseballPlayer object2){
                return object1.getPlayerName().compareTo(object2.getPlayerName());
            }
        });
    }
}
```

객체의 비교를 비교하기 위해서는 Comparable를 구현해 compareTo 메서드를 재정의 하거나 Comparator 인터페이스같이 외부에서 비교 기능을 정의해서 주입할 수 있습니다. 위의 예제는 익명클래스를 이용해 list의 sort 메서드를 정의했습니다.

이제 위의 코드를 람다 표현식으로 변경해 보겠습니다.

```java
list.sort((BaseballPlayer object1, BaseballPlayer object2)->{
    object1.getPlayerName().compareTo(object2.getPlayerName())
})
```

두 코드를 비교해 보면 익명 클래스의 상당히 많은 부분이 추약되고 생략된 것을 확인할 수 있습니다.

그러면 람다 표현식을 사용함으로 얻는 장점을 무엇일까?

- 이름 없는 함수를 선언할 수 있습니다. 메서드는 반드시 특정 클래스나 인터페이스 안에 포함되어야 하고 이름이 있어야 하지만, 람다 표현식은 이러한 제약에서 벗어날 수 있습니다.
- 소스 코드의 분량을 획기적으로 줄일 수 있어, 반복저으로 작업해야 하는 기존의 비효율적인 코드 작성 방식이 필요 없습니다.
- 코드를 파라미터로 전달할 수 있습니다. 외부에서 동작을 정의해서 메서드에 전달할 때 편리하게 사용할 수 있습니다.

## 람다 표현식 이해하기

메서드를 구성하는 요소에 대해 생각해보면 다음과 같습니다.

1. 메서드의 이름
2. 메서드에 전달되는 파라미터 목록
3. 메서드를 구현한 본문
4. 메서드의 리턴 타입

람다 표현식은 이 구성요소 중 1,4번은 생략하고 2,3번만을 작성하며 코드를 단순화 시킵니다.

Runnable 인터페이스를 익명클래스로 쓰레드 객체를 생성하는 코드를 예를 들어 람다 표현식 전환 과정을 보겠습니다.

```java
Thread thread = new Thread(new Runnable(){
    @Override
    public void run(){
        System.out.println("hello");
    }
});
```

### 1. 익명 클래스 선언부 제거

```java
Thread thread = new Thread(
    @Override
    public void run(){
        System.out.println("hello");
    }
);
```

Thread 생성자의 인수는 Runnable 인터페이스가 혹은 이를 구현한 클래스로 한정되기 때문에 인터페이스명을 다시 선언할 필요가 없습니다.

### 2. 메서드 선언부 제거

```java
Thread thread = new Thread(
    {
        System.out.println("hello");
    }
);
```

메서드명과 리턴 타입을 제거합니다. 리턴 타입이 생략되더라도 자바 컴파일러가 데이터 타입 추론을 통해 자동으로 결정해 줍니다.

### 3. 람다 문법으로 정리

```java
Thread thread = new Thread(() -> System.out.println("hello");
);
```

파라미터 목록을 메서드의 본문으로 전달한다는 의미로 '->' 기호를 사용합니다. 위의 경우 입력 파라미터가 없지만 () 같이 명시를 해줘야 됩니다.

람다 표현식 문법을 설명하면서 메서드 파라미터에 익명 클래스를 선언하듯이 람다 표현식을 직접 전달하는 형태로 예제를 알아봤습니다.\
하지만 이 방식은 코드가 조금 길어지거나 람다 표현식 자체를 재사용할 필요가 있을 때 활용성이 떨어지는 단점이 있습니다. 그래서 표현식 자체를 변수로 선언할 수 있습니다.

```java
Runnable runImpl = () -> System.out.println("hello");
Thread thread = new Thread(runImpl);
```

코드를 분리해 위와 같이 변경할 수 있습니다.

더 나아가 메서드의 리턴 타입으로 함수형 인터페이스와 람다 표현식을 조합해서 사용할 수 있습니다.

```java
public Runnable getRunnable(){
    return () -> System.out.println("hello");
}

Runnable runImpl = getRunnable();
```

`getRunnable`의 `return` 뒤 표현식은 Runnable 인터페이스를 정의하는 부분으로, `println`이 실행되는 것은 아닙니다.
`runImpl`에서 `run`메서드가 호출되어야 람다가 실행됩니다.

### 형식 추론

인터페이스에 정의되어 있는 메서드의 파라미터 타입은 사전에 정의하거나 제네릭을 이용해서 타입을 선언합니다. 즉, 어떤 데이터 타입을 사용할지 알고 있기 때문에 이 부분도 생략 가능합니다.

```java
(String str) -> System.out.println(str);
(str) -> System.out.println(str);
```

위의 코드는 동일한 람다 표현식 입니다.
하지만 코드상에서 타입까지 생략하면 가독성이 떨어지고, 어떤 타입이 올지 인터페이스의 메서드 명세서를 참조해야만 알 수 있기 때문에 타입을 명시 할지 말지는 고려하는게 좋습니다.

### 람다 표현식과 변수

표현식 외부 변수도 참조가 가능합니다. 외부 변수를 참조하기 위해서는 반드시 `final` 이거나 `final`과 유사한 조건이어야 합니다. `final` 키워드가 붙지 않아도 값이 할당된 이후에 변경될 가능성이 없다면 컴파일러는 `final` 변수와 동일하게 취급하며, 컴파일 오류가 발생하지 않습니다

```java
int num = 100;
list.strean().forEach((String s) -> System.out.println(s +"+"+ num));
```

## 함수형 인터페이스의 기본

기본적으로 람다 표현식을 사용할 수 있는 인터페이스는 오직 `public` 메서드 하나만 가지고 있는 인터페이스여야 합니다. 이러한 인터페이이스는 함수형 인터페이스라 부르고, 내부의 추상 메서드를 함수형 메서드라 부릅니다. `Runnable` 인터페이스의 경우 `run` 메서드 하나뿐이기 때문에 컴파일러에 의해 람다 표현식이 해당 메서드의 파라미터와 형식에 맞는지 검사하고 컴파일 됩니다.

자바 버전 업그레이드에 따라 인터페이스에 `default`,`static`,`private` 메서드가 추가되었습니다. 이러한 메서드들이 추가되어 있어도 오직 하나의 추상 메서드만이 존재하면 함수형 인터페이스고 해당 메서드를 함수형 메서드로 인식합니다.

사용자 입장에서는 함수형 인터페이스의 조건이 불편하지 않겠지만 프레임워크나 API를 개발하는 개발자 입장에서는 매번 람다 표현식을 위해 인터페이스를 제공하는 것이 번거로울 수 있습니다. 그래서 자바 8에서는 많이 사용할 만한 패번을 정리해 함수형 인터페이스로 만들고 `java.util.function` 패키지로 제공하고 있습니다. 해당 패키지의 자세한 내용은 다음 포스팅에서 알아보겠습니다.

### @FunctionalInterface 어노테이션

함수형 인터페이스는 오직 하나의 추상 메서드를 갖는다는 전제 조건을 만족하면 별도의 어노테이션을 붙이지 않아도 함수형 인터페이스로 취급할 수 있습니다. 하지만 `@FunctionalInterface` 어노테이션을 사용하면 더 명확하게 표현할 수 있고 실수로 추상 메서드를 추가하더라도 컴파일 에러를 일으켜 사전에 문제를 예방할 수 있습니다.

```java
@FunctionalInterface
public interface Consumer<T> {
}

@FunctionalInterface
public interface Comparator<T> {
}
```

`Consumer`,`Comparator` 인터페이스에 해당 어노테이션이 적용되어 있는 모습.

## 메서드 참조
