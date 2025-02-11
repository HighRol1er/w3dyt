import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  // 기본 컨트롤러 메서드들이 필요한 경우 여기에 추가
}
