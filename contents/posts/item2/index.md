---
title: "이펙티브 자바 - 아이템 2"
description: "아이템 2"
date: 2022-03-09
update: 2022-03-09
tags:
  - java
  - effective java
series: "effective java"
---

## 아이템2 - 생성자에 매개변수가 많다면 빌더를 고려하라

static 팩토리 메소드와 public 생성자는 똑같은 제약이 있습니다. 바로 매개변수가 많아질 때 적절히 대응하기가 어렵다는 점입니다. 각각의 경우를 식품 포장의 영양정보를 표현하는 클래스인 `NutritionFacts` 클래스를 예를 들어 설명하겠습니다.

### 생성자

영양정보 클래스는 1회 내용량, 총 n회 제공량, 1회 제공량당 칼로리 같은 필수 항목과 총 지방, 트랜스지방, 포화지방, 콜레스테롤 나트륨 등 여러가지의 선택 항목으로 이루어져 있습니다. 몇몇 항목을 코드로 나타내면 다음과 같습니다.

```java
public class NutritionFacts {
    private int servingSize;
    private int servings;
    private int calories;
    private int sodium;
    private int carbohydrate;
    private int fat;

    public NutritionFacts(int servingSize, int servings) {
        this.servingSize = servingSize;
        this.servings = servings;
    }

    public NutritionFacts(int servingSize, int servings, int calories) {
        this.servingSize = servingSize;
        this.servings = servings;
        this.calories = calories;
    }

    public NutritionFacts(int servingSize, int servings, int calories, int fat) {
        this.servingSize = servingSize;
        this.servings = servings;
        this.calories = calories;
        this.fat = fat;
    }

    public NutritionFacts(int servingSize, int servings, int calories, int sodium, int fat) {
        this.servingSize = servingSize;
        this.servings = servings;
        this.calories = calories;
        this.sodium = sodium;
        this.fat = fat;
    }

    public NutritionFacts(int servingSize, int servings, int calories, int sodium, int carbohydrate, int fat) {
        this.servingSize = servingSize;
        this.servings = servings;
        this.calories = calories;
        this.sodium = sodium;
        this.carbohydrate = carbohydrate;
        this.fat = fat;
    }
}
```

코드를 보면 점층적 생성자 패턴으로 필수 매개변수만 받는 생성자, 필수 매개변수와 선택 매개변수 n개를 받는 생성자를 가지고 있는 모습을 볼 수 있습니다. 그래서 이 클래스의 인스턴스를 만들려면 원하는 생성자를 골라서 생성하면 됩니다.

```java
NutritioinFacts cocaCola = new NutritionFacts(240, 8, 100, 0, 35, 27);
```

위와 같이 인스턴스를 생성할 수 있지만 사용자는 설정하길 원치 않는 매개변수까지 포함하기 쉬워집니다. 위의 코드는 fat에 0을 넘겼습니다. 지금은 매개변수가 6개 뿐이지만 수가 늘어날수록 이러한 코드는 작성하기도 어려워지고 각 값의 의미가 무엇인지도 헷갈려 읽기도 힘들어집니다.

사용자가 실수로 매개변수의 순서를 바꿔 넘겨줘도 컴파일러는 알아채지 못하고, 런타임에 엉뚱한 동작을 하게 될 것 입니다.

### 자바빈즈 패턴(JavaBeans pattern)

자바빈즈 패턴이란 매개변수가 없는 생상자로 객체를 만든 후, setter 메서드를 호출해 원하는 매개변수의 값을 설정하는 방식입니다.

```java
public class NutritionFacts {
    private int servingSize = -1;
    private int servings = -1;
    private int calories = 0;
    private int sodium = 0;
    private int carbohydrate = 0;
    private int fat = 0;

    public void setServingSize(int servingSize) {
        this.servingSize = servingSize;
    }

    public void setServings(int servings) {
        this.servings = servings;
    }

    public void setCalories(int calories) {
        this.calories = calories;
    }

    public void setSodium(int sodium) {
        this.sodium = sodium;
    }

    public void setCarbohydrate(int carbohydrate) {
        this.carbohydrate = carbohydrate;
    }

    public void setFat(int fat) {
        this.fat = fat;
    }

    public static void main(String[] args) {
        NutritionFacts nutritionFacts = new NutritionFacts();
        nutritionFacts.setCalories(100);
        nutritionFacts.setCarbohydrate(27);
        nutritionFacts.setServings(8);
        nutritionFacts.setServingSize(240);
        nutritionFacts.setSodium(35);
    }
}
```

위의 점층적 생성자 패턴의 작성이 어렵고 읽기가 어렵다는 단점은 더 이상 보이지 않습니다. 코드는 길어졌지만 객체를 생성하기 더 쉽고, 읽기 쉬운 코드가 됐습니다.

하지만 자바빈즈 패턴은 객체하나를 만들려면 여러 개의 메서드를 호출해야 하고, 객체가 완전히 생성되기 전까지 일관성이 무너진 상태에 놓이게 됩니다. 중간에 사용되는 경우 안정적이지 않은 상태로 사용될 여지가 있습니다. 또한 setter, getter가 있어서 불편 클래스로 만들 수 없고, 쓰레드 안정성을 보장하려면 lock같은 추가적인 수고가 필요합니다.

이러한 단점 때문에 객체를 freezing하는 방식을 사용할 수 있지만 실전에서는 거의 쓰이지 않습니다. 사용자가 freeze 메서드를 확실히 호출해줬는지 컴파일러가 보증할 방법이 없기 때문입니다.

### 빌더 패턴(Builder pattern)

빌더 패턴이란 사용자가 필요한 객체를 직접 만드는 대신, 필수 매개변수만으로 생성자(혹은 static 팩토리 메서드)를 호출해 빌더 객체를 얻고, 빌더 객체가 제공하는 세터 메서드들로 원하는 선택 매개변수들을 설정하고 마지막으로 `build` 메서드를 호출해 객체를 얻는 방법입니다. 빌더는 생성할 클래스 안에 static 멤버 클래스로 만들어두는게 보통입니다.

코드를 살펴보겠습니다.

```java
public class NutritionFacts {
    private int servingSize;
    private int servings;
    private int calories;
    private int sodium;
    private int carbohydrate;
    private int fat;

    public static class Builder{
        // 필수 멤버
        private final int servingSize;
        private final int servings;
        // 선택 멤버
        private int calories = 0;
        private int fat = 0;
        private int sodium = 0;
        private int carbohydrate = 0;

        public Builder(int servingSize, int servings) {
            this.servingSize = servingSize;
            this.servings = servings;
        }

        public Builder calories(int val) {
            calories = val; return this;
        }
        public Builder fat(int val) {
            fat = val; return this;
        }
        public Builder sodium(int val) {
            sodium = val; return this;
        }
        public Builder carbohydrate(int val) {
            carbohydrate = val; return this;
        }
        public NutritionFacts build(){
            return new NutritionFacts(this);
        }
    }

    private NutritionFacts(Builder builder){
        servingSize = builder.servingSize;
        servings = builder.servings;
        calories = builder.calories;
        sodium = builder.sodium;
        carbohydrate = builder.carbohydrate;
        fat = builder.fat;
    }
}
```

`NutritionFacts` 클래스는 불변이며, 모든 멤버변수의 기본값들을 한 곳에 모아뒀습니다. 클래스의 정적 내부 클래스 `Builder`의 setter 메서드들은 빌더 자기 자신을 반환하기 때문에 연쇄적으로 메서드를 호출할 수 있습니다. 이러한 방식을 fluent API 또는 method chaining이라고 합니다.

```java
public static void main(String[] args) {
       NutritionFacts nutritionFacts = new NutritionFacts.Builder(240, 8)
               .calories(100)
               .sodium(35)
               .carbohydrate(27).build();
    }
```

실제로 객체를 생성하는 코드를 보면 쓰기 쉽고, 일기도 쉬운 것을 볼 수 있습니다. 빌더 패턴은 파이썬이나 스칼라에 있는 named optional parameters를 흉내낸 것입니다. [링크](https://realpython.com/python-optional-arguments/)

유효성 검사 코드는 생략됐습니다. 빌더의 생상자와 메서드에서 입력 매개변수를 검사하고, build 메서드가 호출하는 생성자에서 여러 매개변수에 걸친 불변식(invariant)를 검사하는 방식으로 유효성 검사를 진행할 수 있습니다.

빌더 패턴은 계층적으로 설계된 클래스와 함께 쓰기에도 좋습니다. 각 계층의 클래스에 관련 빌더를 멤버로 정의하고, 추상 클래스는 추상 빌더를, 구현 클래스에서 구현 빌더를 갖게해 사용할 수 있습니다. 피자를 예를 들어 설명하겠습니다.

```java
public abstract class Pizza {
    public enum Topping {HAM, MUSHROOM, ONION, PEPPER, SAUSAGE}
    final Set<Topping> toppings;

    Pizza(Builder<?> builder){
        toppings = builder.toppings.clone();
    }

    abstract static class Builder<T extends Builder<T>>{ //재귀적 타입 매개변수
    // 비어있는 enumSet 생성
        EnumSet<Topping> toppings = EnumSet.noneOf(Topping.class);
        public T addTopping(Topping topping) {
            // Null check
            toppings.add(Objects.requireNonNull(topping));
            return self();
        }

        abstract Pizza build();

        // 하위 클래스는 self 메서드를 재정의하여 this를 반환하도록 해야한다.
        protected abstract T self();
    }
}
```

`Pizza.Builder` 클래스는 재귀적 타입 매개변수를 사용하는 제네릭 타입입니다. 여기에 추상메서드 `self`를 더해 하위 클래스테서는 형변한을 하지 않고도 메서드 체이닝을 지원할 수 있습니다. self 타입이 없는 자바를 위한 이 방법을 simulated self-type이라고 합니다.

Pizza의 하위 클래스 NyPizza의 코드를 살펴보겠습니다.

```java
public class NyPizza extends Pizza{
    public enum Size{SMALL,MEDIUM,LARGE}
    private final Size size;

    private NyPizza(Builder builder){
        super(builder);
        size = builder.size;
    }

    public static class Builder extends Pizza.Builder<Builder>{
        private final Size size;

        public Builder(Size size){
            this.size = Objects.requireNonNull(size);
        }

        @Override
        public NyPizza build() {
            return new NyPizza(this);
        }

        @Override
        protected Builder self() {
            return this;
        }
    }
}
```

하위 클래스의 빌더가 정의한 `build` 메서드는 해당하는 구현 클래스를 반환하도록 선언했습니다. `NyPizza.Builder`는 `NyPizza`를 반환하고, 이치럼 하위 클래스의 메서드가 상위 클래스의 메서드가 정의한 반환 타입이 아닌, 그 하위 타입을 반환하는 거슬 공변 반환 타이핑(covariant return type)이라고 합니다. 이 기능을 사용하면 위에서 말한대로 형변환없이 빌더를 사용할 수 있습니다.

사용코드

```java
NyPizza pizza = new NyPizza.Builder(NyPizza.Size.SMALL)
                        .addTopping(Pizza.Topping.HAM)
                        .addTopping(Pizza.Topping.MUSHROOM).build();
```

이처럼 빌더 패턴은 빌더 하나로 여러 객체를 순회하면서 만들 수 있고, 넘기는 매개변수에 따라 다른 객체를 만들 수 있어 매우 유연하다고 할 수 있습니다.

하지만 빌더 패턴은 위의 코드에서 보이듯이 어느정도의 빌더 생성 비용이 있고 점층적 생성자 패턴보다는 코드가 장황하기 때문에 매개변수가 4개 이상은 되어야 값어치를 합니다.
