    "rateLimits": [
        {
            "rateLimitType": "REQUEST_WEIGHT", // exchangeInfo같은 경우는 weight가 1임
            "interval": "MINUTE", // 분
            "intervalNum": 1, // 1분
            "limit": 6000 // 1분당 최대 6000개
        },
        {
            "rateLimitType": "ORDERS",
            "interval": "SECOND",
            "intervalNum": 10,
            "limit": 100
        },
        {
            "rateLimitType": "ORDERS",
            "interval": "DAY",
            "intervalNum": 1,
            "limit": 200000
        },
        {
            "rateLimitType": "RAW_REQUESTS",
            "interval": "MINUTE",
            "intervalNum": 5,
            "limit": 61000
        }
    ],

TRADING_STATUS
✅ PRE_TRADING: 거래 시작 전 (상장 전)
✅ TRADING: 정상 거래 가능 상태
✅ POST_TRADING: 거래 종료 후 (상장 폐지 후)
✅ END_OF_DAY: 상장 폐지 하루 전 (거래 종료 예정)
✅ HALT: 긴급 거래 중단 (사건, 보안, 규제 문제 등)
✅ BREAK: 일시적 거래 중단 (시스템 점검 등)
✅ AUCTION_MATCH: "경매" 방식으로 주문 체결되는 상태
