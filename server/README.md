### 개선할 곳

1. scrpits/auto-upbit-market-data.ts (NOTE:)
2. upbit-websocket.service.ts (XXX: 웹소켓 연결 시도 횟수 제한 필요)

### 현재 문제점

2월 14일

- websocket으로 받은 데이터를 한번은 저장해야되는데
  Redis에 저장할지 PostgreSQL에 저장할지 고민중
  이게 지금 어떻게 저장을 해야할지 모르겠음

### WebSocket 사용 이유

API를 사용하는 것보다 실시간 데이터에 어울림
polling 방식 이런거 뭐 있던데 좀 더 알아보자
