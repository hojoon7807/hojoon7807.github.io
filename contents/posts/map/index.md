---
title: "HashMap, HashTable, ConcurrentHashMap"
description: "HashMap, HashTable, ConcurrentHashMap의 차이"
date: 2022-02-25
update: 2022-02-25
tags:
  - java
---

## HashMap, HashTable, ConcurrentHashMap의 차이

HashMap, HashTable, ConcurrentHashMap은 모두 Java API 이름이다.

HashTable과 HashTable 그리고 ConcurrentHashMap을 정의한다면, '키에 대한 해시 값을 사용하여 값을 저장하고 조회하며, 키-값 쌍의 개수에 따라 동적으로 크기가 증가하는 associate array'라고 할 수 있다. 이 associate array를 지칭하는 다른 용어가 있는데, 대표적으로 Map, Dictionary, Symbol Table 등이다.

이 셋은 유사한 특징들을 가지고 있지만 세부적으로는 차이점이 존재한다.

각각의 차이점을 알아보자

## Hashtable

Hashtable이란 JDK 1.0 부터 있던 Java의 API다.

구현 코드의 일부를 살펴보자.

```java
public class Hashtable<K,V>
    extends Dictionary<K,V>
    implements Map<K,V>, Cloneable, java.io.Serializable{

    public Hashtable() {
        this(11, 0.75f);
    }

    public synchronized int size() {
        return count;
    }

    public synchronized V get(Object key) {
        Entry<?,?> tab[] = table;
        int hash = key.hashCode();
        int index = (hash & 0x7FFFFFFF) % tab.length;
        for (Entry<?,?> e = tab[index] ; e != null ; e = e.next) {
            if ((e.hash == hash) && e.key.equals(key)) {
                return (V)e.value;
            }
        }
        return null;
    }

    public synchronized V put(K key, V value) {
        // Make sure the value is not null
        if (value == null) {
            throw new NullPointerException();
        }
        // Makes sure the key is not already in the hashtable.
        Entry<?,?> tab[] = table;
        int hash = key.hashCode();
        int index = (hash & 0x7FFFFFFF) % tab.length;
        @SuppressWarnings("unchecked")
        Entry<K,V> entry = (Entry<K,V>)tab[index];
        for(; entry != null ; entry = entry.next) {
            if ((entry.hash == hash) && entry.key.equals(key)) {
                V old = entry.value;
                entry.value = value;
                return old;
            }
        }

        addEntry(hash, key, value, index);
        return null;
    }
}
```

Hashtable 클래스의 대부분의 API를 보면 많은 메소드에 **synchronized** 키워드가 존재하는 것을 볼 수 있다. 메소드 전체가 임계구역으로 설정된다.
그렇기 때문에 멀티스레스 환경에서 안정성을 보장 받을 수 있다.

하지만 동시에 작업을 하려해도 객체마다 Lock을 하나씩 가지고 있기 때문에 동시에 여러 작업을 해야할 때 병목 현상이 발생할 수 밖에 없다. 메소드에 접근하게 되면 다른 쓰레드는 Lock을 얻을 때까지 기다려야 하기 때문이다.

이런 이유로 Hashtable은 Thread-safe 하다는 특징이 있지만 멀티 스레드 환경에서 사용하기에 느리다는 단점이 있다. 그리고 Java Collections Framework 이전 JDK 1.0 부터 존재하던 API로 하위 호환성을 제공하기 위해 있기 때문에 구현에는 거의 변화가 없다.

또 Key와 Value에 null 값을 허용하지 않고 초기 Capacity가 11이다.

## HashMap

다음은 HashMap을 살펴보겠다.

```java
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable {

    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

    public V put(K key, V value) {
        return putVal(hash(key), key, value, false, true);
    }

    final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        Node<K,V>[] tab; Node<K,V> p; int n, i;
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);
        else {
            Node<K,V> e; K k;
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            else if (p instanceof TreeNode)
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }

    public V get(Object key) {
        Node<K,V> e;
        return (e = getNode(hash(key), key)) == null ? null : e.value;
    }

    //보조 해시 함수
    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }
}

```

HashMap은 Java2에서 처음 나온 Java Collections Framework에 속한 API 이다. AbstractMap 추상클래스를 구현하고, Hashtable과 마찬가지로 Map 인터페이스를 구현했기 때문에 제공하는 기능은 같다.

Hashtable과 차이점은 보조 해시 함수를 사용하기 때문에 Hashtable에 비하여 해시 충돌이 덜 발생할 수 있어 상대적으로 성능상 이점이 있다. 그리고 초기 capacity가 16인 것을 볼 수 있고, Key와 Value에 모두 Null 값을 허용한다.

```java
    static final int TREEIFY_THRESHOLD = 8;

    static final int UNTREEIFY_THRESHOLD = 6;
```

또 차이점은 Separate Chaining의 구현 방식에 있는데 위의 코드 처럼 하나의 버킷에 키-값 쌍의 데이터의 개수가 8개가 되면 링크드 리스트에서 트리로 변경시키고, 데이터를 삭제해 6개가 되면 다시 링크드 리스트로 변경한다. 링크드 리스트 대신 트리를 사용할 수 있도록 Entry 클래스 대신 Node 클래스를 사용한다.

HashMap은 다른 API와 다르게 synchronized가 선언되 있지 않다. 성능은 가장 좋다고 할 수 있지만 Thread-safe 하지 않다. 그래서 멀티스레드의 환경에서 사용하려면 Collections.synchronizedMap(hashMap) 같이 동기화 처리가 필요하다.

## ConcurrentHashMap

ConcurrentHashMap은 Hashtable 클래스의 단점을 보완하면서 멀티스레드 환경에서 사용할 수 있도록 만들어진 클래스다.

그럼 어떤 차이가 다른 Map들과 어떤 차이가 있을지 알아보자.

```java
public interface ConcurrentMap<K,V> extends Map<K,V>

public class ConcurrentHashMap<K,V> extends AbstractMap<K,V>
    implements ConcurrentMap<K,V>, Serializable {

    private static final int DEFAULT_CAPACITY = 16;
    private static final int DEFAULT_CONCURRENCY_LEVEL = 16;

    static final int TREEIFY_THRESHOLD = 8;
    static final int UNTREEIFY_THRESHOLD = 6;

    public V get(Object key) {
        Node<K,V>[] tab; Node<K,V> e, p; int n, eh; K ek;
        int h = spread(key.hashCode());
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (e = tabAt(tab, (n - 1) & h)) != null) {
            if ((eh = e.hash) == h) {
                if ((ek = e.key) == key || (ek != null && key.equals(ek)))
                    return e.val;
            }
            else if (eh < 0)
                return (p = e.find(h, key)) != null ? p.val : null;
            while ((e = e.next) != null) {
                if (e.hash == h &&
                    ((ek = e.key) == key || (ek != null && key.equals(ek))))
                    return e.val;
            }
        }
        return null;
    }

    public V put(K key, V value) {
        return putVal(key, value, false);
    }

    final V putVal(K key, V value, boolean onlyIfAbsent) {
        if (key == null || value == null) throw new NullPointerException();
        int hash = spread(key.hashCode());
        int binCount = 0;
        for (Node<K,V>[] tab = table;;) {
            Node<K,V> f; int n, i, fh; K fk; V fv;
            if (tab == null || (n = tab.length) == 0)
                tab = initTable();
            else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
                if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value)))
                    break;                   // no lock when adding to empty bin
            }
            else if ((fh = f.hash) == MOVED)
                tab = helpTransfer(tab, f);
            else if (onlyIfAbsent // check first node without acquiring lock
                     && fh == hash
                     && ((fk = f.key) == key || (fk != null && key.equals(fk)))
                     && (fv = f.val) != null)
                return fv;
            else {
                V oldVal = null;

                synchronized (f) {
                    if (tabAt(tab, i) == f) {
                        if (fh >= 0) {
                            binCount = 1;
                            for (Node<K,V> e = f;; ++binCount) {
                                K ek;
                                if (e.hash == hash &&
                                    ((ek = e.key) == key ||
                                     (ek != null && key.equals(ek)))) {
                                    oldVal = e.val;
                                    if (!onlyIfAbsent)
                                        e.val = value;
                                    break;
                                }
                                Node<K,V> pred = e;
                                if ((e = e.next) == null) {
                                    pred.next = new Node<K,V>(hash, key, value);
                                    break;
                                }
                            }
                        }
                        else if (f instanceof TreeBin) {
                            Node<K,V> p;
                            binCount = 2;
                            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                                           value)) != null) {
                                oldVal = p.val;
                                if (!onlyIfAbsent)
                                    p.val = value;
                            }
                        }
                        else if (f instanceof ReservationNode)
                            throw new IllegalStateException("Recursive update");
                    }
                }
                if (binCount != 0) {
                    if (binCount >= TREEIFY_THRESHOLD)
                        treeifyBin(tab, i);
                    if (oldVal != null)
                        return oldVal;
                    break;
                }
            }
        }
        addCount(1L, binCount);
        return null;
    }
}
```

ConcurrentHashMap은 AbstractMap 추상 클래스를 구현하고 ConcurrentMap 인터페이스를 구현한 것을 볼 수 있다.

HashMap과 마찬가지로 초기 capacity는 16이고, 하나의 버킷에 키-값 데이터가 8개가 되면 트리고 변하고 6개가 되면 다시 링크드 리스트로 변하게 된다.\
Hashtable처럼 Key와 Value에 null값을 허용하지 않는다.

마찬가지로 ConcurrentHashMap은 Thread-safe한데 Hashtable과 어떤 차이가 있을까?

**synchronized**의 선언부에 차이가 있다. ConcurrentHashMap은 일부 메소드와 그 메소드 내부 일부에만 **synchronized**가 선언되어 있다.\
그리고 `private static final int DEFAULT_CONCURRENCY_LEVEL = 16;`처럼 ConcurrentHashMap은 기본적으로 16개의 Lock을 사용해 관리한다.

`putval`의 메소드를 보면 이미 노드가 존재하는 경우(노드가 존재하는 해시 버킷 객체)에만 **synchronized** 를 사용해 하나의 쓰레드만 접근할 수 있도록 제어한다. 서로 다른 쓰레드가 같은 해시 버킷에 접근할 때만 해당 블록이 잠기게 된다.

따라서 메소드 전체에 락을 거는 Hashtable보다 내부에 여러개의 세그먼트를 두고 각 세그먼트마다 별도의 락을 가지고 있는 ConcurrentHashMap이 더 빠르다.

## 마치며

HashMap, HashTable, ConcurrentHashMap의 차이를 간단하게 정리해보면 다음과 같다.

- HashMap은 Thread-safe 하지 않고 Hashtable, ConcurrentHashMap은 Thread-safe하다
- HashMap은 null 허용하지만 Hashtable, ConcurrentHashMap은 null을 허용하지 않는다.
- HashMap, ConcurrentHashMap은 초기 capacity가 16이고 하나의 버킷에 데이터의 개수가 8이 넘어갈 경우 linkedList -> tree 구조로 바뀐다. Hashtable은 초기 capacity가 11이다.
- ConcurrentHashMap이 Hashtable 보다 성능이 좋다.

차이점을 토대로 상황에 따라 적합한 Map을 써야 성능을 낼 수 있을 것 같다.

ConcurrentHashMap 빈 해시 버킷에 노드를 삽입 하는 경우,lock을 사용하지 않고 Compare and Swap(cas)을 이용하여 삽입한다는데 cas는 나중에 atomic 클래스를 공부할때 자세히 알아봐야겠다.
