import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderMatchingEngineService {
  getHello(): string {
    return 'Hello World!';
  }
}
