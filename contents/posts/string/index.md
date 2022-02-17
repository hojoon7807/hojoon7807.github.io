---
title: "문자열 중복 "
description: "문자열 중복 확인"
date: 2022-02-17
update: 2022-02-17
tags:
  - 알고리즘
---

## 문제

문자열 중복 확인

문자열이 주어졌을 때, 이 문자열에 같은 문자가 중복되어 등장하는지 확인하는 알고리즘을 작성하라.

## 나의 첫 풀이

문자열 "abcda"가 주어졌을 때 'a'가 중복되므로 false를 반환하고 "abcd"가 주어지면 중복이 없으므로 true를 반환하면 된다.

부끄럽지만 내가 처음에 짠 코드는 다음과 같다.

```java
public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String st=br.readLine();
        System.out.println(isDuplicated(st));
    }

    public static boolean isDuplicated(String string) {
        char[] chars = new char[string.length()];
        string.getChars(0, string.length(), chars, 0);

        for (int i = 0; i < chars.length; i++) {
            char value = chars[i];
            for (int j = 0; j < chars.length; j++) {
                if (i == j) {
                    continue;
                }else if(value==chars[j]){
                    return false;
                }
            }
        }
        return true;
    }
}
```

1. 입력 받은 문자열을 char 배열로 변환시킨다.
2. 첫 번째 for문에서는 배열의 내용과 비교할 값을 뽑아낸다.
3. 다음 for문에서 뽑아낸 값의 인덱스 i와 비교하고자 하는 배열의 인덱스 j가 같으면 continue로 건너뛰고 다음 비교에서 같은 값이 찾아지면 false를 반환한다.

물론 원하는 결과를 얻을 순 있지만 간단히 보기만해도 비효율적인 코드라는 것이 느껴진다...

## 풀이 2

문자열이 ASCII 문자열이라고 가정해 보자. 아스키 문자열은 1비트는 에러 확인을 위한 parity bit로 사용하고, 그리고 나머지 7비트로 총 128개의 부호를 나타낸다. 그러면 문자열의 길이가 128이 넘어가게되면 당연히 중복된 문자가 있을 수 밖에 없다. 그리고 `'A' = 65 'B' = 66`같이 고유의 정수 값을 가지고 있다. 이를 토대로 코드를 작정하면 다음과 같다.

```java
public static boolean isDuplicated(String string){
        if (string.length()>128) return false;
        boolean[] check = new boolean[128];
        for (int i = 0; i < string.length(); i++) {
            int val = string.charAt(i);
            if (check[val]) {
                return false;
            }
            check[val] = true;
        }
        return true;
    }
```

1. 문자열의 길이가 128을 넘어가면 false를 반환한다.
2. 문자열의 길이만큼 반복문을 돌며 해당 값이 이미 존재하는지 확인한다.

아스키 문자열이라고 가정하는 것 하나로 코드가 간단해졌다.
이 코드의 시간 복잡도는 O(n)이다. (n은 문자열의 길이)

## 풀이 3

비트 벡터를 사용하면 필요한 공간을 줄일 수 있다. 문자열이 소문자 a부터 z까지라고 가정한다.
a부터 z까지의 문자는 총 26개이다.

```java
public static boolean isDuplicated(String string){
    int checker = 0;
    for (int i=0; i<string.length(); i++){
        int val = string.charAt(i) - 'a';
        if((checker & (1<<val))>0){
            return false;
        }
        checker |= (1<<val);
    }
    return true;
}
```

1. 만약 `string.charAt(i) = 'a'`라면 `val = 0`, `string.charAt(i) = 'b'` 라면 `val=1`....라고 할 수 있다. 따라서 val는 0에서 25까지의 정수 값이 될 수 있다.
2. `1<<val`는 1을 val 만큼 왼쪽 시프트 연산하여 해당 알파벳을 비트 값으로 표현한다. 연산 후의 값은 `a = .... 0001`, `b = .... 0010`, `g = .... 0100 0000`이 된다.
3. `if((checker & (1<<val))>0)` 조건문에서는 checker와 알파벳 비트값을 AND 연산하여 값의 중복여부를 판단한다.
4. `checker |= (1<<val);` OR 연산으로 해당 알파벳의 비트 값을 1로 조정한다.

---

### 결론

다양한 풀이를 알아보았다. 내가 처음에 풀었던 코드는 너무 형편없지만 꾸준히 문제를 풀어나가면 더 효율적인 방법을 찾고 새로운 시각으로 문제를 풀어나갈 수 있을 것이라 기대한다...
