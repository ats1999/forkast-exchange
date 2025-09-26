import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderManagementServiceService {
  getHello(user: any): string {
    return `Hello ${user.name}!`;
  }
}
