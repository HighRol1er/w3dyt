# 김치프리미엄 트래커 (Kimchi Premium Tracker)

실시간으로 국내외 거래소의 가격 차이를 보여주는 김치프리미엄 트래킹 서비스입니다.

## 주요 기능

- 실시간 김치프리미엄 계산 및 표시
- 주요 암호화폐 거래소 가격 비교
  - 국내: 업비트, 빗썸
  - 해외: 바이낸스, 코인베이스, OKX, Bybit
- historical 데이터 차트 제공 - tradingview 사용
- 프리미엄 알림 서비스 - 프리미엄 임계치 설정 후 알림 발송 (텔레그램/ rn같은경우는 알람도 가능할듯)
- 거래소별 실시간 거래량 표시

## 기술 스택

### Frontend

- Next.js
- shadcn/ui
- zod
- tanstack query
- Metamask 연동고려 중

- TypeScript
- TailwindCSS
- WebSocket (실시간 데이터) / API 호출

### Backend

- nestjs
- postgres / neon
- drizzle
- Redis (캐싱)
- WebSocket (실시간 데이터 전송) / API 호출 cronjob 사용
- 환율데이터는 google finance 크롤링

### 인프라 수정가능

- AWS EC2 (서버 호스팅)
- AWS Route 53 (도메인 관리)
- Docker (컨테이너화)
- Github Actions (CI/CD)

  ***

  ***

  프로젝트 데이터 처리 및 아키텍처 분석 정리

1. 마켓 데이터의 클라이언트 전달 방식
   WebSocket을 이용한 실시간 데이터 전송
   거래소 → 서버 (Collector): WebSocket API를 통해 실시간 데이터 수집
   서버 → 클라이언트: Socket.IO를 활용하여 실시간 데이터 전송
2. 데이터 처리의 핵심 로직이 구현된 주요 파일
   Collector 관련
   src/collector/_.ts → 각 거래소의 데이터를 수집하는 로직
   WebSocket 처리
   src/gateway/_.ts → 서버와 클라이언트 간 실시간 데이터 전달
   Redis 캐싱
   src/services/redis.service.ts → 가격 데이터 저장 및 조회
   PostgreSQL 데이터 관리
   src/repositories/\*.ts → 마켓 메타데이터 저장 및 조회
3. Redis와 PostgreSQL의 데이터 저장 역할
   Redis (실시간 가격 데이터 저장)
   각 거래소에서 수집된 코인 가격 정보를 메모리 기반으로 저장
   exchange:baseToken:quoteToken 형식으로 저장
   빠른 조회 및 캐싱 기능 활용
   PostgreSQL (마켓 메타데이터 저장)
   각 거래소에서 제공하는 코인 페어 목록 저장 (bithumb_markets, binance_markets, upbit_markets 등)
   영구적인 데이터 저장 (거래소 API 장애 시 활용 가능)
4. 거래소 WebSocket 데이터 처리 방식
   각 거래소별 WebSocket 클라이언트
   binance.client.ts, bithumb.client.ts, upbit.client.ts 등에서 개별 구현
   실시간 데이터를 수신하고, 이를 Redis에 저장 후 클라이언트로 전달
   10초마다 갱신하며, 레이트 리밋을 고려하여 청크 단위 요청 수행
   데이터 전파 흐름
   거래소 WebSocket → 서버에서 표준화된 포맷으로 변환 → Redis 저장 → 클라이언트로 실시간 전송
5. Redis를 사용하는 이유
   실시간성: 초 단위로 업데이트되는 가격 데이터를 빠르게 처리
   확장성: 수천 개의 코인 페어와 다수의 동시 사용자를 지원
   안정성: 거래소 API 장애 발생 시 최근 가격 데이터를 제공
   효율성: 데이터베이스 부하를 줄이고, 빠른 캐싱 및 조회 성능 제공
   일관성: 분산 서버 환경에서 데이터 동기화 및 레이스 컨디션 방지
6. 결론
   PostgreSQL은 거래소에서 제공하는 마켓 정보(코인 페어 목록, 수수료 등)를 영구적으로 저장
   Redis는 실시간 가격 데이터를 저장하여 빠른 응답과 안정적인 데이터 제공을 보장
   전체적인 아키텍처는 실시간성이 중요한 암호화폐 데이터 서비스에 최적화됨
   이 구조를 유지하면 고성능, 확장성, 안정성을 갖춘 실시간 암호화폐 데이터 제공이 가능함.
