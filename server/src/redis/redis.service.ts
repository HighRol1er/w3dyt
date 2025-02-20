import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;

  constructor(private configService: ConfigService) {
    const host =
      this.configService.get('NODE_ENV') === 'production'
        ? this.configService.get('REDIS_HOST', 'redis')
        : 'localhost';

    this.client = createClient({
      url: `redis://${host}:${this.configService.get('REDIS_PORT', '6379')}`,
    });
  }
  // 모듈 초기화 시 Redis 연결
  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('Redis connection failed:', error);
      // 개발 환경에서는 Redis 연결 실패를 허용
      if (this.configService.get('NODE.ENV') === 'production') {
        throw error;
      }
    }
  }

  // Redis 데이터 저장
  async set(key: string, value: string, ttl?: number) {
    try {
      if (ttl) {
        await this.client.set(key, value, { EX: ttl });
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error('Redis set failed:', error);
      // Redis 작업 실패 조용히 처리
    }
  }

  async get(key: string) {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Redis get failed:', error);
      return null;
    }
  }

  // Redis 키 목록 조회
  async getKeys(pattern: string) {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      console.error('Redis getKeys failed:', error);
      return [];
    }
  }

  // Redis 키 목록 디버깅
  async debugKeys(pattern: string) {
    const keys = await this.client.keys(pattern);
    const values = await Promise.all(
      keys.map(async key => {
        const value = await this.client.get(key);
        return { key, value };
      }),
    );
    return values;
  }

  // 모든 데이터 삭제
  async flushAll() {
    await this.client.flushAll();
  }

  // 특정 키 삭제
  async del(...keys: string[]) {
    await this.client.del(keys);
  }

  // 연결 종료
  async close() {
    await this.client.quit();
  }
}
