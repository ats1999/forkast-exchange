import { Test, TestingModule } from '@nestjs/testing';
import { OrderManagementServiceController } from './order-management-service.controller';
import { OrderManagementServiceService } from './order-management-service.service';

describe('OrderManagementServiceController', () => {
  let orderManagementServiceController: OrderManagementServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrderManagementServiceController],
      providers: [OrderManagementServiceService],
    }).compile();

    orderManagementServiceController =
      app.get<OrderManagementServiceController>(
        OrderManagementServiceController,
      );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // expect(orderManagementServiceController.getHello()).toBe('Hello World!');
    });
  });
});
