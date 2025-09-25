import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderManagementServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
