---
title: "equals와 =="
description: "equals와 =="
date: 2022-02-10
update: 2022-02-10
tags:
  - java
---

## equals 와 ==

equals 와 == 연산자는 기본적으로 양 쪽의 내용을 비교한 결과를 boolean type으로 반환한다는 공통점을 가지고 있다.

### ==연산자

== 연산자는 피 연산자가 기본 자료형 타입일 경우 값이 같은지 비교하고, 피연산자가 그 외 객체 참조 타입인 경우 주소값을 비교한다.

```java
    int num1 = 1;
    int num2 = 1;
    int num3 = 3;
    System.out.println(num1==num2); //true
    System.out.println(num1==num3); //false

    String str1 = "HI";
    String str2 = "HI";
    System.out.println(str1==str2); //true

    String str3 = new String("HI");
    String str4 = new String("HI");
    System.out.println(str3==str4); //false
    System.out.println(str3==str2); //false

    Person person = new Person(0, "hojoon");
    Person person2 = new Person(0, "hojoon");
    System.out.println(person==person2); //false
```

위의 예제를 보면 기본자료형 타입은 값을 비교하기 때문에 true와 false를 반환한 것을 볼 수 있다.

String 타입인 경우 결과가 좀 특이한 것을 볼 수 있는데 이것은 생성 방식에 따른 차이이다.
new를 이용해 객체를 생성하면 Heap 영역에 존재하게 되고 리터럴을 이용해 객체를 생성하면 String pool이라는 영역에 존재하게 된다. 그래서 str1은 HI라는 문자열을 String pool에 넣게되고 str2는 이미 같은 문자열이 String pool에 존재하기 때문에 같은 객체를 참조하게 된다.
따라서, `str1==str2 // true`, `str3==str4 //false`, `str2==str3 //false`라고 결과가 나온다.
String pool은 나중에 더 자세히 다뤄보자.

### equals()

위의 예제에서 `person`과 `person2`는 다른 객체이기 때문에 주소값이 다르지만 그 안의 속성값들은 같다. 이 같은 경우 처럼 eqauls() 메소드는 비교하고자 하는 객체의 내용을 비교하기 위해 사용한다.

```java
//Object

public boolean equals(Object obj) {
    return (this == obj);
}
```

Object 클래스에는 단순하게 주소값을 비교하게 해놨다. 모든 Object의 자식 클래스이므로 해당 클래스에서 equals() 메소드를 오버라이딩해서 구현하면된다. 사용하는 IDLE의 기능을 이용하면 다음과 같이 구현된다.
(읽고있는 책에서는 기본적으로 hashCode()메소드는 객체의 주소를 16진수로 리턴하고 equals()를 오버라이딩하지 않으면 hashCode()값을 비교한다해서 hashCode를 오버라이딩해서 확인을 해봤더니 false가 나왔다. Object의 hashcode()는 주소를 리턴한다는 것을 주소값을 비교한다는 의미로 써있는건지 잘 모르겠다...)

```java
public class Person {
    private int id;
    private String name;

    public Person(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Person person = (Person) o;

        if (id != person.id) return false;
        return name != null ? name.equals(person.name) : person.name == null;
    }
}
```

이제 equals() 메소드를 이용해 비교를 해보면 다음의 결과가 나온다.

```java
public class Equals {
    public static void main(String[] args) {
        String str1 = "HI";
        String str2 = "HI";
        System.out.println(str1.equals(str2)); //true

        String str3 = new String("HI");
        String str4 = new String("HI");
        System.out.println(str3.equals(str4)); //true
        System.out.println(str3.equals(str1)); //true

        Person person = new Person(0, "hojoon");
        Person person2 = new Person(0, "hojoon");
        System.out.println(person.equals(person2)); //true
    }
}
```

그런데 String은 따로 equals()를 작성하지 않았는데 어떻게 true를 반환하게 되는걸까? String 클래스에서 확인해보면 자체적으로 값을 비교하게 equals() 메소드를 오버라이딩 해놓은 것을 볼 수 있다.

```java
//String.java

public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String aString = (String)anObject;
        if (coder() == aString.coder()) {
            return isLatin1() ? StringLatin1.equals(value, aString.value)
                              : StringUTF16.equals(value, aString.value);
        }
    }
    return false;
}
```

그런데, 한 가지 유념해야 될 부분은 equals() 메소드를 오버라이딩 할때는 hashCode() 메소드도 같이 오버라이딩 해야된다. hashCode() 메소드는 기본적으로 객체의 메모리 주소값을 16진수로 리턴한다. 그래서 equal() 메소드를 재정의해서 객체가 서로 같다고 할 수는 있지만 주소값은 서로 다르기 때문에 hashCode() 메소드의 값은 다르게 된다.
따라서 같은 hashCode() 결과를 갖도록 하려면 equals와 마찬가지로 오버라이딩 해줘야된다.

```java
public class Person {
    private int id;
    private String name;

    public Person(int id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Person person = (Person) o;

        if (id != person.id) return false;
        return name != null ? name.equals(person.name) : person.name == null;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }
}

```

String은 equals와 마찬가지로 이미 구현이 되어있다.

```java
//String.java

public int hashCode() {
    int h = hash;
    if (h == 0 && value.length > 0) {
        hash = h = isLatin1() ? StringLatin1.hashCode(value)
                              : StringUTF16.hashCode(value);
    }
    return h;
}
```

### 만약 hashCode()를 재정의 하지 않았다면..

만약 hashCode()를 재정의 하지 않았다면 어떤 부작용이 생길 수 있을까??

hashCode()를 재정의 하지 않은 같은 두 객체를 HashSet에 넣는다고 가정해보자.

```java
public class Equals {
    public static void main(String[] args) {
        Person person = new Person(0, "hojoon");
        Person person2 = new Person(0, "hojoon");
        System.out.println(person.equals(person2)); //true
        System.out.println(person.hashCode()); // 1456208737
        System.out.println(person2.hashCode()); // 288665596

        Set<Person> personSet = new HashSet<>();
        personSet.add(person);
        personSet.add(person2);

        for(Person tmp:personSet){
            System.out.println(tmp);
        }
        //p.Person@1134affc
        //p.Person@56cbfb61
        System.out.println(personSet.size()); // 2
    }
}
```

다음과 같이 personSet의 사이즈가 2가 나왔다.

```java
//HashSet.java

public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable
{
    static final long serialVersionUID = -5024744406713321676L;

    private transient HashMap<E,Object> map;

    // Dummy value to associate with an Object in the backing Map
    private static final Object PRESENT = new Object();

    /**
     * Constructs a new, empty set; the backing {@code HashMap} instance has
     * default initial capacity (16) and load factor (0.75).
     */
    public HashSet() {
        map = new HashMap<>();
    }

    public boolean add(E e) {
        return map.put(e, PRESENT)==null;
    }
}
```

HashSet의 구현을 보면 내부적으로 HashMap을 이용하고 더미 객체와 add() 메서드의 파라미터를 put()메서드에 key와 value로 인자로 넣어준다.

```java
//HashMap.java

static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
```

HashMap의 구현을 보면 인자로 받아온 객체의 hashCode()를 이용해 키를 해쉬값으로 변환한다.
그래서 위의 예제에서는 내용은 같지만 hashCode() 값이 다르기때문에 Set에 중복값으로 인식이 되지 않는다.

```java
public class Equals {
    public static void main(String[] args) {
        Person person = new Person(0, "hojoon");
        Person person2 = new Person(0, "hojoon");
        System.out.println(person.equals(person2)); //true
        System.out.println(person.hashCode()); //-1211756693
        System.out.println(person2.hashCode()); //-1211756693

        Set<Person> personSet = new HashSet<>();
        personSet.add(person);
        personSet.add(person2);
        for(Person tmp:personSet){
            System.out.println(tmp);  //p.Person@b7c60f6b
        }
        System.out.println(personSet.size()); //1
    }
}
```

다시 hashCode()를 재정의해 실행해보니 원하는 결과가 나온다.
