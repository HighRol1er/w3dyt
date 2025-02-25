### 개선할 곳 (해결)

1. scrpits/auto-upbit-market-data.ts (NOTE:)
2. upbit-websocket.service.ts (XXX: 웹소켓 연결 시도 횟수 제한 필요) - 해결

### 현재 문제점 (해결)

2월 14일

- websocket으로 받은 데이터를 한번은 저장해야되는데
  Redis에 저장할지 PostgreSQL에 저장할지 고민중
  이게 지금 어떻게 저장을 해야할지 모르겠음

  -> Cron작업으로 받은 데이터는 postgresql에 저장
  -> websocket으로 받은 데이터는 redis에 저장

### WebSocket 사용 이유

API를 사용하는 것보다 실시간 데이터에 어울림
polling 방식 이런거 뭐 있던데 좀 더 알아보자 <<---------------- 폴링 방식이 뭔지 알아야겠네

### Redis 사용 이유(2/16) (해결)

- 소켓만 연결한 채로 냅두게 되면 거래가 일어나지 않는 데이터는 즉각적으로 UI에 들어오지 않음
  미리 Redis가 가지고 있는 데이터를 클라이언트에게 넘겨주고 소켓을 연결 시켜야 함
  -> 근데 굳이 Redis를 사용할 필요가 있는지 모르겠음

  Why? => upbit에서 실시간 스냅샷 기능을 제공하기 때문에
  만약 실시간 스냅샷 기능을 제공하지 않는 거래소가 있다면 이건 사용할 필요가 있긴 함

2월 17일

### 소켓 연결 테스트에서 발견한 문제 1 (해결)

- 기본적인 틀이 되는 데이터를 db에서라도 딱 받아와서 schema대로 가격 데이터를 넣어줘야 할거같음
- 이래서 db를 써야하나? ..

-> http 구현체를 만들어서 해결했음

### 소켓 연결 데스트에서 발견한 문제 2

- 웹소켓 특성상 connection이 되면 코인 가격 데이터들이 랜덤하게 (거래가 일어나는 순으로 ) 들어오게되는데

이 순서를 체계적으로 즉, 순서를 정해주기 위해서서는
db에 미리 거래소에 있는 코인 페어 정보를 넣어놓고 그거에 해당하는 데이터를 매칭해서 뿌려주는 로직이 필요할 듯

- DB 업데이트는 scripts를 디벨롭해서 폐지/상장 될때를 캐치해서 해야할 듯

### 데이터 포멧을 일정하게 가져가야할듯 (해결)

- 너무 중구난방이다.
  /exchange, , /scripts 이렇게 둘다

  -> 안쓰는 코드로 변경됨

### scripts (해결)

- 중복된 코드가 너무 많음
- 이거 코드 줄여보자

-> 스크립트 안씀

### base-ws.service.ts - 해결

- any 타입 제네릭을 쓰든 좀 바꾸자. <- 이건 지체하지말고 바로 수정하자
- any 타입 대신 유니온 타입으로 해결

### 웹소캣 연결하고 onclose 이벤트 (해결)

- websocket 연결 끊기면 onclose 이벤트에 맞춰서
  다시 재연결하는 로직 필요.

  -> handleReconnect 메서드 추가했음

### 2/19일 bybit 웹소캣 문제

- 한번에 구독할 수 있는 심볼이 10개
- 멀티 웹소캣(5개)으로 50개정도 까지 열어는 볼만한데
- 553개를 전부 열면 50개 이상을 열어야되서 문제임
- 이걸 어떻게 해결할 수 있을지는 좀 더 고민 일단 10개만 가져올 수 있게끔 코드 짜자

### 2/19일 coinbase 웹소캣 문제

- open price가 롤링 24시간이라서 우리나라 9시 기준이랑은 다르다.
- 정확한 open price를 계산하려면 스냅샷을 9시에 찍어서 이걸 기준으로 데이터를 다뤄줘야 함
- 현재는 빈값으로 냅뒀음

### 2/19일 okx 웹소캣 문제

- 애도 change rate coinbase 처럼 구해야줘야 함
- 현재는 빈값으로 냅뒀음

### 2/20 거래소 스크립트 작성한 뻘짓 ( 당장해결하자) (해결)

- 현재 프로세스

1. upbit API 호출
2. 데이터를 json파일로 저장
3. json 파일 읽기
4. DB 저장

- 개선하려는 부분

1. upbit API 호출
2. 필요한 정보만 DB에 저장

### 2/20 언제 DB의 거래소 데이터들을 업데이트 할 것이냐?

market_state_for_ios msfi 거래 상태 (*Deprecated) String
is_trading_suspended its 거래 정지 여부 (*Deprecated) Boolean
delisting_date dd 거래지원 종료일 Date

- 이렇게 데이터가 오는데 여기서 dd가 값이 있을 경우엔 새로 데이터를 업데이트 해야함

1. 거래소한테 데이터를 요청함
2. 응답 받은 데이터를 파싱함
3. 파싱한 데이터를 DB에 저장함
4. 저장한 데이터를 클라이언트에 전달함

- 레디스에 저장하는 시점은 거래소에서 데이터를 요청하는 시점이 아니라 클라이언트에서 데이터를 요청하는 시점

---

WebSocket 데이터를 Redis Pub/Sub을 사용하여 빠르게 전파
→ 여러 클라이언트에 실시간 가격을 전달
DB에서 가져온 currency_pair 목록을 캐싱하여 빠르게 응답
→ API 성능 최적화, DB 부하 감소
최근 가격 정보를 Redis에 저장하여 재접속 시 빠르게 제공
→ WebSocket 연결이 끊겨도 최신 데이터 유지

이렇게 라는데??

# redis 저장 방식은 이렇게

redis는 웹소켓 데이터 저장 + 최신 가격 정보 유지
-> 캐싱을 오래 해놓을 수록 자원낭비인가?

# DB 저장 방식

- DB는 cron 작업으로 저장 + 업데이트

그러니깐 웹소캣이 연결이 되어있는데 어떤 "XXX"코인이 거래가 안일어나서 clinet 측으로 내가 정보를 못주는 상황이면
해당 사용자는 해당 "XXX"코인에 대한 가격 데이터는 전혀 못받는 상황이 되어버리잖아
이 때 해결방법은 미리 DB에 저장해둔 가격 데이터를 불러와서 빈값으로 안나오게 설정할 수 있지?

---

그리고 그러다가 웹소캣에 데이터가 들어오면 새로운 데이터로 교체해주는 방식이야
📌 결론
✅ 웹소켓 데이터가 없을 경우, DB에서 마지막 저장된 데이터를 제공하여 빈값이 나오지 않게 함
✅ 웹소켓 데이터가 들어오면 Redis & DB를 최신 데이터로 업데이트
✅ Redis는 단기 캐싱 (5분 TTL), DB는 장기 저장

👉 이렇게 하면 거래가 없는 코인도 가격 데이터를 제공할 수 있고, 실시간 업데이트도 가능해! 🚀

# 2월 23일 내가 궁금했던 것중 하나

upbitApiService를 upbitservice.ts랑 upbit-ws.service.ts에서 주입받아서 사용중인데
이게 인스턴스가 두번 생성되고 서로 공유되는게 아닐 수 있다는 생각이 들었는데
그걸 확인하기 위해
upbitApiService에서 console.log를 찍어보니 인스턴스가 진짜 딱 한번만 찍힘
이게 NestJS의 싱글톤이구나 !!

# 신규상장 혹은 상장페지에 대한 것

cronjob으로 가져오는건 그대로 하고 30분마다 거래소 api를 사용해서 db랑 데이터를 비교해서
신규 상장 종목 혹은 상장폐지되는 종목이 있다면 api를 새로 호출해서 새로 없어진 자산 혹은 생긴 자산만 push로 넣어야하나?

# 2월 25일 구독 메세지 갱신 문제 (해결)

현재 getSymbolData()로 가져와서 웹소캣 구독을 진행하는데
이렇게하면 신규 상장 혹은 폐지 됐을 때도 똑같은 메세지를 보냄
db는 주기적인 cron작업을 진행하니깐 이걸
db데이터랑 비교해서 새로운 or 없어진 코인이 있는지 vaildate하는 함수를 만들어서
검증을 해야될 듯

-> DB데이터를 가져오는 시점에서 db랑 비교해서 새로운 변경점이 있을경우엔 웹소켓 구독 메세지를 갱신해주는 방식으로 변경

# 2월 25일웹소캣 재연결 횟수 문제 (해결)

[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [CollectorService] Collecting Upbit tickers...
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [CollectorService] Collecting Bithumb tickers...
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [UpbitHttpService] Fetched market data for Upbit
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [BithumbHttpService] Fetched market data for Bithumb
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [CollectorService] Market list changed, refreshing WebSocket connection...
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [UpbitWebSocketService] Refreshing Upbit WebSocket subscription...
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [CollectorService] Successfully collected Upbit tickers
[Nest] 38724 - 02/25/2025, 3:19:00 PM WARN [UpbitWebSocketService] Disconnected from Upbit WebSocket
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [UpbitWebSocketService] Reconnecting... Attempt 2/5
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [UpbitWebSocketService] Upbit WebSocket Connected
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [CollectorService] Successfully collected Bithumb tickers
[Nest] 38724 - 02/25/2025, 3:19:00 PM LOG [CollectorService] Successfully collected market data from all exchanges
[Nest] 38724 - 02/25/2025, 3:19:01 PM LOG [UpbitWebSocketService] Upbit WebSocket Connected

재연결 문제랑 30초마다 초기화 될때마다 Market list changed가 되어버리네.. WTF

-> 데이터가 완전히 내 BE서버로 파싱됐을 때 재연결 횟수 초기화를 시켜줌
