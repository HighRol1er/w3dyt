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

 