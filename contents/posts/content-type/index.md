---
title: "[토이 프로젝트] - Content-Type - application/json"
description: "item 78"
date: 2022-05-09
update: 2022-05-09
tags:
  - java
  - spring
---

## 토이 프로젝트 코드에서의 문제점

이번에 Comment 기능에 대해 단위 테스트 코드를 작성하고 보냈던 PR에 멘토님이 이런 코드리뷰를 해주셨다.

![스크린샷 2022-05-09 오후 8.42.34](/Users/hojunlim/Documents/my-blog-starter/contents/posts/jvm/스크린샷 2022-05-09 오후 8.42.34.png)

Controller에서 테스트 코드를 작성하고 결과를 비교하는데, "댓글이 삭제되었습니다." 응답이 `UTF-8` 필터가 적용되었는데 계속 ???로 응답이 됐다. 그래서 구글링을 해 억지로 헤더에 `"Content-Type", "application/json; charset=UTF-8"`을 적용시켜서 해봤더니 작동이 잘되서 바로 PR을 날렸는데 저런 리뷰를 해주셨다. 

지금까지 했던 프로젝트는 아무생각없이 json을 사용했었고 이번에도 별 생각없이 구글링 한 결과를 복붙했는데 리뷰를 보고 그러게 왜 문자열인데 application/json을 적용했지라는 생각이 들면서 json이 정확하게 뭐지라는 생각이 들어서 포스팅을 하게됐다.

## JSON

 [Json 공식 페이지](https://www.json.org/json-ko.html)에서는 JSON을 다음과 같이 설명하고 있다.

> **JSON** (JavaScript Object Notation)은 경량의 DATA-교환 형식이다. 이 형식은 사람이 읽고 쓰기에 용이하며, 기계가 분석하고 생성함에도 용이하다.
>
> JSON은 두개의 구조를 기본으로 두고 있다.
>
> - name/value 쌍의 collection 타입으로, 다양한 언어들에서, 이는 *object*, record, struct(구조체), dictionary, hash table, 키가 있는 list, 또는 연상배열로서 실현 되었다.
> - 값들의 순서화된 리스트로, 대부분의 언어들에서, 이는 *array*, vector, list, 또는 sequence로서 실현 되었다.

위의 설명대로 JSON은 name/value 의 컬렉션인데, 당연히 내가 작성한 "댓글이 삭제되었습니다." 라는 응답의 문자열을 application/json이라는 Content-Type으로 헤더를 작성한게 말이 안되는 설정이었다.

 굳이 Content-Type을 설정하려면 말씀해주신대로 text/plain이 맞는 설정이라 생각하고, 프론트 개발을 접했을 때를 생각하니 React에서 Response를 `const {status, data} = response 이런식으로 사용할텐데 단순히 문자열 value 값만 온다면 처리가 힘들어 진다는 부분도 이해가 됐다.

## 해결방안

생각한 해결방안은 그냥 void로 리턴을 하던가, 간단한 응답 객체를 만들어 리턴하는 방식인데, 나는 그래도 처리에 대한 간단한 메세지 정도는 있는게 좋을 것 같아 간단한 응답 객체를 만들기로 했다.

SimpleMessageResponse.java

```java
@AllArgsConstructor
@Getter
public class SimpleMessageResponse {
    private int status;
    private String message;
}
```

CommentController.java

```java
@DeleteMapping("/posts/{postId}/comments/{commentId}")
public ResponseEntity<SimpleMessageResponse> commentRemove(@PathVariable Long commentId) {
    commentService.removeComment(commentId);
    return new ResponseEntity<>(new SimpleMessageResponse(HttpStatus.OK.value(), commentId + ": 댓글이 삭제되었습니다."),HttpStatus.OK);
}
```

SimpleMessageResponse 응답 클래스를 만들어 주었고 Controller는 다음과 같이 수정했다.

CommentControllerTest.java

```java
@Test
@DisplayName("id에 해당하는 comment가 있으면 정상적으로 comment를 삭제한다")
void commentRemove() throws Exception{
  final Long ID = 1L;
  mockMvc.perform(delete("/posts/1/comments/{commentId}", ID))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.status").value(200))
    .andExpect(jsonPath("$.message").value(ID+": 댓글이 삭제되었습니다."))
    verify(commentService,times(1)).removeComment(ID);
}
```

![스크린샷 2022-05-09 오후 10.09.52](/Users/hojunlim/Documents/my-blog-starter/contents/posts/jvm/스크린샷 2022-05-09 오후 10.09.52.png)

테스트 코드를 수정하고 테스트를 실행해보니 잘 돌아간다.

## Post 요청과 Content-Type의 관계

글을 작성하려고 서칭을 하다보니 [Post 요청과 Content-Type의 관계에](https://blog.naver.com/PostView.naver?blogId=writer0713&logNo=221853596497&redirect=Dlog&widgetTypeCall=true&directAccess=false) 대한 포스팅을 읽게 되었다. 

보통 RestAPI의 경우 Json 타입으로 요청하고, 요청을 받는데 그래서 당연히 Content-Type application/json 으로 사용한다고 생각하지만 html form 태그에서 post 방식으로 요청하거나, jQuery의 ajax요청 같은 상황에서는 "application/x-www-form-urlencoded; charset=UTF-8"이 사용된다.

jQuery 공식문서에는 다음과 같이 써있다.

> Default is "application/x-www-form-urlencoded; charset=UTF-8", which is fine for most cases. If you explicitly pass in a content-type to `$.ajax()`, then it is always sent to the server (even if no data is sent). As of jQuery 1.6 you can pass `false` to tell jQuery to not set any content type header.

그래서 Content-Type에 따라서 client에서 server로 보내는 데이터의 형식이 달라진다.

- application/x-www-urlencoded 

  ```
  POST / HTTP/1.1
  Host: localhost
  Content-Type: applicaton/x-www-form-urlencoded
  
  name=lim&age=20
  ```

- application/json

  ```
  POST / HTTP/1.1
  Host: localhost
  Content-Type: applicaton/json
  
  {
  	"name":"lim",
  	"age":"20"
  }
  ```



### 백엔드에서 처리

그럼 프론트에서 보내는 요청의 데이터 형식에 따라서 벡엔드는 어떻게 처리해야될까?

`@RequestBody, @ModelAttribute, @RequestParam` 등의 어노테이션을 사용하면 해당 어노테이션과 매칭되는 메세지 컨버터가  `ResquestMappingHandlerAdapter`의 동작을 통해서 등록된다. `AnnotationMethodHandlerAdapter`는 Spring 3.2 부터 deprecating 되었다. 

기존에 Json으로 요청을 보내는 방식에 추가적으로 x-www-urlencoded 방식을 추가로 제공하려면 다음과 같이 사용하면된다.

```java
@PostMapping(value = "/users", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResponseDTO> userSave(@RequestBody @Valid CreateUserRequest createUserRequest){
        log.info("json request. username: {}",createUserRequest.getUsername());
        User user = userService.addUser(createUserRequest.toCommand());
        return new ResponseEntity<>(UserResponseDTO.from(user), HttpStatus.CREATED);
    }

    @PostMapping(value = "/users", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<UserResponseDTO> userSaveFormRequest(@Valid CreateUserRequest createUserRequest){
        log.info("form request. username: {}",createUserRequest.getUsername());
        User user = userService.addUser(createUserRequest.toCommand());
        return new ResponseEntity<>(UserResponseDTO.from(user), HttpStatus.CREATED);
    }
```

첫 번째 메소드는 json, 두번째 메소드는 x-www-urlencoded 타입을 받게 된다.

테스트 코드

```java
    @Test
    @DisplayName("application/json 타입의 회원가입 요청을 정상적으로 처리하고 가입 유저를 반환한다. ")
    void userSaveJsonRequest() throws Exception {
        final String USERNAME = "user1";
        final String PASSWORD = "1234";
        CreateUserRequest createUserRequest = new CreateUserRequest(USERNAME, PASSWORD);
        User user1 = new User(1L, USERNAME, PASSWORD);
        UserResponseDTO userResponse = UserResponseDTO.from(user1);
        when(userService.addUser(any(CreateUserCommand.class))).thenReturn(user1);

        ResultActions resultActions = mockMvc.perform(
                post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createUserRequest))
        );

        resultActions.andExpect(status().isCreated())
                .andExpect(jsonPath("id",userResponse.getId()).exists())
                .andExpect(jsonPath("username", userResponse.getUsername()).exists());

        verify(userService, times(1)).addUser(any(CreateUserCommand.class));
    }
```

![스크린샷 2022-05-10 오후 3.18.48](/Users/hojunlim/Documents/my-blog-starter/contents/posts/jvm/스크린샷 2022-05-10 오후 3.18.48.png)

```java
    @Test
    @DisplayName("application/x-www-form-urlencoded 타입의 회원가입 요청을 정상적으로 처리하고 가입 유저를 반환한다. ")
    void userSaveFormRequest() throws Exception {
        final String USERNAME = "user1";
        final String PASSWORD = "1234";
        CreateUserRequest createUserRequest = new CreateUserRequest(USERNAME, PASSWORD);

        User user1 = new User(1L, USERNAME, PASSWORD);
        when(userService.addUser(any(CreateUserCommand.class))).thenReturn(user1);

        ResultActions resultActions = mockMvc.perform(
                post("/users")
                        .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                        .param("username",USERNAME)
                        .param("password",PASSWORD)
        );

        resultActions
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(user1.getId()))
                .andExpect(jsonPath("$.username").value(user1.getUsername()));

        verify(userService, times(1)).addUser(any(CreateUserCommand.class));
    }
```

![스크린샷 2022-05-10 오후 3.19.33](/Users/hojunlim/Documents/my-blog-starter/contents/posts/jvm/스크린샷 2022-05-10 오후 3.19.33.png)

테스트도 문제없이 통과한 모습을 볼 수 있다.

코드를 추가하다가 예상치도 못한 곳에서 문제가 발생했었는데 요청받는 객체인 `CreateUserRequest`에서 문제가 생겼었다. @ModelAttribute에서 값을 객체로 바인딩 할때는 기본적으로 프로퍼티 접근법을 사용한다.

- 해당 객체를 생성(기본 생성자)
- setter를 이용해 값을 객체에 주입

```java
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    @NotEmpty
    private String username;

    @NotEmpty
    private String password;

    public CreateUserCommand toCommand(){
        return new CreateUserCommand(username, password);
    }
}
```

기존 코드는 @RequestBody 때문에 @Getter와 @NoArgsConstructor 어노테이션을 추가했었고 테스트 코드에서는 @AllArgsConstructor로 객체를 생성해서 사용했었다.

@ModelAttribute에서도 모든 필드를 매개변수로 받는 생성자로 바인딩을 할 수 있지만, 이미 기본 생성자가 있기때문에 프로퍼티 접근법으로 작동이 되었고 setter가 없어서 계속 에러가 발생한 것이었다.

```java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    @NotEmpty
    private String username;

    @NotEmpty
    private String password;

    public CreateUserCommand toCommand(){
        return new CreateUserCommand(username, password);
    }
}
```

@Setter를 추가하니 문제없이 작동했다.
